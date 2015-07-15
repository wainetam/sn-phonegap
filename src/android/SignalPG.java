package com.signal360.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import com.google.gson.Gson;

import android.app.Application;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.res.Configuration;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import android.preference.PreferenceManager;
import android.view.View;
import android.view.ViewGroup;

import android.os.Handler;
import android.os.Message;
import android.os.Bundle;
import android.util.Log;

import com.signal360.sdk.core.Signal;
import com.signal360.sdk.core.SignalClient;
import com.signal360.sdk.core.SignalSdkStatus;
import com.signal360.sdk.core.internal.SignalInternal;
import com.signal360.sdk.core.objects.SignalActivation;
import com.signal360.sdk.core.objects.SignalActivationRule;
import com.signal360.sdk.core.objects.SignalAudioCodeHeard;
import com.signal360.sdk.core.objects.SignalBluetoothCodeHeard;
import com.signal360.sdk.core.objects.SignalCodeHeard;
import com.signal360.sdk.core.objects.SignalLocation;
import com.signal360.sdk.ui.SignalUI;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created by wainetam on 6/30/15.
 */
public class SignalPG extends CordovaPlugin implements SignalClient {

    private static final String TAG = "PhoneGap/Signal360";
    
    // Signal methods
    private static final String INITIALIZE="initialize";
    private static final String START="start";
    private static final String STOP="stop";
    private static final String IS_BLUETOOTH_ENABLED="isBluetoothEnabled";
    private static final String IS_ADVERTISING_IDENTIFIER_ENABLED="isAdvertisingIdentifierEnabled";
    private static final String SET_CUSTOMER_IDENTIFIER="setCustomerIdentifier";
    private static final String RESET="reset";
    private static final String CHECK_CONFIG="checkConfig";
    private static final String GET_ACTIVATIONS_WITH_CODEHEARD="getActivationsWithCodeHeard";
    private static final String ALL_ACTIVE_CONTENT="allActiveContent";

    private SharedPreferences prefs;
    static final String PREF_APPLICATION_GUID = "sonic.guid";

    @Override
    public boolean execute(String action, JSONArray arguments, CallbackContext callbackContext) throws JSONException {

        try {
            if (INITIALIZE.equals(action)) {
//                prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

                String appID = arguments.getString(0);
                Boolean isQuiet = false;

                if (arguments.length() > 1 && (arguments.get(1) instanceof Boolean)) {
                    isQuiet = arguments.getBoolean(1);
                }

                Signal.get().initialize(this, this, appID);
                SignalUI.get().initialize(this, this, R.class);

                SignalInternal.getInternal().setQuiet(isQuiet);

//                Signal.get().start();

                // do I need to save guid in preferences, or does by default?

                callbackContext.success("");
                return true;
            } else if (START.equals(action)) {
                Signal.get().start();
                callbackContext.success("");
                return true;
            } else if (STOP.equals(action)) {
                Signal.get().stop();
                callbackContext.success("");
                return true;
            } else if (IS_BLUETOOTH_ENABLED.equals(action)) {
                Boolean enabled = Signal.get().isBluetoothEnabled();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (IS_ADVERTISING_IDENTIFIER_ENABLED.equals(action)) {
                Boolean enabled = Signal.get().isAdvertisingIdentifierEnabled();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (SET_CUSTOMER_IDENTIFIER.equals(action)) {
                String customerIdentifier = arguments.getString(0);
                Signal.get().setCustomerIdentifier(customerIdentifier);
                callbackContext.success("");
                return true;
            } else if (RESET.equals(action)) {
                Signal.get().reset();
                callbackContext.success("");
                return true;
            } else if (CHECK_CONFIG.equals(action)) {
//                Signal.get().reset();
                // is there an equivalent in android?
                callbackContext.success("");
                return true;
            } else if (GET_ACTIVATIONS_WITH_CODEHEARD.equals(action)) {
                int beaconCode = arguments.getInt(0);

                if (beaconCode != 0) {
                    // how to treat both Audio vs Bluetooth how to get rssi value, or just set value to create code?
                    SignalCodeHeard code = new SignalBluetoothCodeHeard(beaconCode, -50);
                    Signal.get().getActivationsWithCodeHeard(code);
                    callbackContext.success("");
                }
                return true;
            } else if (ALL_ACTIVE_CONTENT.equals(action)) {
                List content = Signal.get().getAllActiveContent();

                Gson gson = new Gson();
                String json = gson.toJson(content);
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, json));
                return true;
            } else {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.INVALID_ACTION));
                return false;
            }
        } catch (JSONException e) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
            return false;
        }
        return false;
    }

    /**
     * Called every time the SDK successfully decodes a valid code. To receive the associated
     * piece of content which is tied to this beaconCode, then return true. Otherwise return false.  If true
     * is returned, didReceiveActivations will be called once the associated piece of content is retrieved.
     *
     * @param signal - instance of sonic that the client is listening to
     * @param codeHeard - the codeHeard, check the type to determine the source of the code and additional information
     * @return whether or not Sonic should query the server for content, results ORed with the overloaded method.
     */
    @Override
    public Boolean didHearCode(Signal signal, SignalCodeHeard codeHeard) {
//        Log.v(TAG, "Heard Signal" + codeHeard);
//        return null;
        Gson gson = new Gson();
        String json = gson.toJson(codeHeard);

        String js = String.format("javascript:SignalPG._nativeDidHearCodeCall('%s')", json);
        this.webView.loadUrl(js);

        if (codeHeard != null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Called when a piece of content has been successfully retrieved from the server. SonicActivation is a element
     * of the SonicActivation class which contains relevant content.
     *
     * @param signal - instance of signal that the client is listening to
     * @param activations - activations received from the server
     */
    @Override
    public void didReceiveActivations(Signal signal, List<SignalActivation> activations) {
        Gson gson = new Gson();
        String json = gson.toJson(activations);

        String js = String.format("javascript:SignalPG._nativeDidReceiveActivationsCall('%s')", json);
        this.webView.loadUrl(js);
    }

    /**
     * This method is called post initialization whenever there is content available to cache.  It is the applications
     * job to cache the appropriate content in an offline manner.
     *
     * @param signal - instance of signal that the client is listening to
     * @param contents - content to prepare for offline access
     */
    public void cacheOfflineContent(Signal signal, List<SignalActivationRule> contents) {

    }

    /**
     * Called when a geo fence is entered.
     *
     * @param location
     */
    @Override
    public void geoFenceEntered(SignalLocation location) {
//        try {
//            SignalAudioCodeHeard codeHeard = new SignalAudioCodeHeard(Long.valueOf(location.getName()), null, null);
//            Signal.get().getActivationsWithCodeHeard(codeHeard);
//            String jsString;
//            String jsonString = nil;
//            jsString = jsonString;
//
//        } catch(NumberFormatException e) {
//        }
        Gson gson = new Gson();
        String json = gson.toJson(location);

        String js = String.format("javascript:SignalPG._nativeDidGeoFenceEntered('%s')", json);
        this.webView.loadUrl(js);
    }

    /**
     * Called when a geo fence is exited.
     *
     * @param location
     */
    @Override
    public void geoFenceExited(SignalLocation location) {
        Gson gson = new Gson();
        String json = gson.toJson(location);

        String js = String.format("javascript:SignalPG._nativeDidGeoFenceExited('%s')", json);
        this.webView.loadUrl(js);
    }

    /**
     * Called when geo fences are retrieved from the server.  A new set of locations are retrieved based on movement
     * and time heuristics.
     *
     * @param locations
     */
    @Override
    public void geoFencesUpdated(List<SignalLocation> locations) {
        Gson gson = new Gson();
        String json = gson.toJson(locations);

        String js = String.format("javascript:SignalPG._nativeDidGeoFenceEntered('%s')", json);
        this.webView.loadUrl(js);
    }

    /**
     * Called when the sdk status has changed.  On first initialization, the SDK status start in UNKNOWN then transitions
     * into a final state.
     *
     * @param newStatus - The new status
     */
    @Override
    public void didStatusChange(SignalSdkStatus newStatus) {

        Gson gson = new Gson();
        String json = gson.toJson(newStatus);

        String js = String.format("javascript:SignalPG._nativeDidStatusChange('%ld')", json);
        this.webView.loadUrl(js);
    }

    /**
     * Called when the sdk finishes registering with the Sonic servers
     *
     * @param success whether or not signal succeeded to register
     */
    @Override
    public void didCompleteRegistration(boolean success) {
        String js = String.format("javascript:SignalPG._nativeDidCompleteRegistration('%d')", success);
        this.webView.loadUrl(js);
    }

    /**
     * Called when the sdk updates configuration
     * @param changed whether or not a new configuration was retrieved
     */
    @Override
    public void didUpdateConfiguration(boolean changed) {
        String js = String.format("javascript:SignalPG._nativeDidUpdateConfiguration('%d')", changed);
        this.webView.loadUrl(js);
    }

    /**
     * Called when an activation query is being generated.  Client should
     * provide any applicable advanced targeting (demographic, etc) tags
     * for input to the server-side content decisioning system
     *
     * @param codeHeard
     * @return a map of tag names and values
     */
    @Override
    public Map<String, String> getTagsForCode(SignalCodeHeard codeHeard) {
        Gson gson = new Gson();
        String json = gson.toJson(codeHeard);

        String js = String.format("javascript:SignalPG._nativeGetTagsForCode('%s')", json);
        this.webView.loadUrl(js);

        return null;
    }
}
