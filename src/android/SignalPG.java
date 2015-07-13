package com.example.hello;
//package com.signal360.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

import com.signal360.sdk.core.Signal;
import com.signal360.sdk.ui.SignalUI;

/**
 * Created by wainetam on 6/30/15.
 */
public class SignalPG extends CordovaPlugin {

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
    private static final String DID_HEAR_CODE_CB="_nativeDidHearCodeCB";
    private static final String DID_RECEIVE_ACTIVATIONS_CB="_nativeDidReceiveActivationsCB";
    private static final String DID_STATUS_CHANGE_CB="_nativeDidStatusChangeCB";
    private static final String DID_GEOFENCE_ENTERED_CB="_nativeDidGeoFenceEnteredCB";
    private static final String DID_GEOFENCE_EXITED_CB="_nativeDidGeoFenceExitedCB";
    private static final String DID_GEOFENCES_UPDATED_CB="_nativeDidGeoFencesUpdatedCB";
    private static final String DID_COMPLETE_REGISTRATION_CB="_nativeDidCompleteRegistrationCB";
    private static final String DID_UPDATE_CONFIGURATION_CB="_nativeDidUpdateConfigurationCB";
    private static final String GET_TAGS_FOR_CODE_CB="_nativeGetTagsForCodeCB";

    private SharedPreferences prefs;
    static final String PREF_APPLICATION_GUID = "sonic.guid";

    @Override
    public boolean execute(String action, JSONArray arguments, CallbackContext callbackContext) throws JSONException {

        try {
            if (INITIALIZE.equals(action)) {
                prefs = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

                String appID = arguments.getString(0);
                Boolean isQuiet = false;

                if (arguments.length() > 1 && (arguments.get(1) instanceof Boolean)) {
                    isQuiet = arguments.getBoolean(1);
                }

                Signal.get().initialize(this, this, appID);
                SignalUI.get().initialize(this, this, R.class);

                Signal.setQuiet(isQuiet);

                Signal.get().start();
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
                Boolean disabled = Signal.get().getAdvertisingIdentifierDisabled();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, !disabled));
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
                    SignalCodeHeard code = new SignalCodeHeard(beaconCode);
                    Signal.get().getActivationsWithCodeHeard(code);
                    callbackContext.success("");
                }
                return true;
            } else if (ALL_ACTIVE_CONTENT.equals(action)) {
                List content = Signal.get().getAllActiveContent();
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, content));
                return true;
            } else if (DID_HEAR_CODE_CB.equals(action)) {
                
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_RECEIVE_ACTIVATIONS_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_STATUS_CHANGE_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_GEOFENCE_ENTERED_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_GEOFENCE_EXITED_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_GEOFENCES_UPDATED_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_COMPLETE_REGISTRATION_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (DID_UPDATE_CONFIGURATION_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
                return true;
            } else if (GET_TAGS_FOR_CODE_CB.equals(action)) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabled));
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
}
