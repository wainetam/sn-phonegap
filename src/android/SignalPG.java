package com.signal360.plugin;

// import com.example.hello.R;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
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
import com.signal360.sdk.ui.SignalUIClient;
import com.signal360.sdk.ui.activities.SignalContentNavigatorActivity;
import com.signal360.sdk.ui.activities.SignalContentWebViewActivity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created by wainetam on 6/30/15.
 */
public class SignalPG extends CordovaPlugin implements SignalClient, SignalUIClient {

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

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Signal.get().initialize(cordova.getActivity().getApplicationContext(), this, "ZjAwNmM3ZTgtOTkzNS00ZjMxLTk4ZmUtNzRhNDNiNDQzZWE1");
        // SignalUI.get().initialize(cordova.getActivity().getApplicationContext(), this, cordova.getActivity().getApplicationContext().getResources().getClass());
        SignalUI.get().initialize(cordova.getActivity().getApplicationContext(), this, com.signal360.plugin.mainpackage.R.class);
        
        // SignalUI.get().initialize(cordova.getActivity().getApplicationContext(), this, R.class);
        Signal.get().start();
    }

    @Override
    public boolean execute(String action, JSONArray arguments, CallbackContext callbackContext) throws JSONException {

        try {
            if (INITIALIZE.equals(action)) {
                String appID = arguments.getString(0);
                Boolean isQuiet = false;

                if (arguments.length() > 1 && (arguments.get(1) instanceof Boolean)) {
                    isQuiet = arguments.getBoolean(1);
                }

                Signal.get().initialize(cordova.getActivity().getApplicationContext(), this, appID);
                SignalUI.get().initialize(cordova.getActivity().getApplicationContext(), this, cordova.getActivity().getApplicationContext().getResources().getClass());

                SignalInternal.getInternal().setQuiet(isQuiet);
                Signal.get().start();

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
    }

    @Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        Signal.get().onActivityPause(cordova.getActivity());
    }

    /**
     * Called when the activity will start interacting with the user.
     *
     * @param multitasking      Flag indicating if multitasking is turned on for app
     */
    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        Signal.get().onActivityResume(cordova.getActivity());
    }

    /**
     * Called when the WebView does a top-level navigation or refreshes.
     *
     * Plugins should stop any long-running processes and clean up internal state.
     *
     * Does nothing by default.
     */
    @Override
    public void onReset() {
        super.onReset();
    }

    /**
     * Called when the activity is becoming visible to the user.
     */
    @Override
    public void onStart() {
        super.onStart();
    }

    /**
     * Called when the activity is no longer visible to the user.
     */
    @Override
    public void onStop() {
        super.onStop();
    }

    /**
     * Called when the activity receives a new intent.
     */
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

    }

    /**
     * The final call you receive before your activity is destroyed.
     */
    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    /**
     * Called by the system when the device configuration changes while your activity is running.
     *
     * @param newConfig     The new device configuration
     */
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
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
        Gson gson = new Gson();
        String json = gson.toJson(codeHeard);

        final String js = String.format("javascript:SignalPG._nativeDidHearCodeCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });

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

        final String js = String.format("javascript:SignalPG._nativeDidReceiveActivationsCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
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
        Gson gson = new Gson();
        String json = gson.toJson(location);

        final String js = String.format("javascript:SignalPG._nativeDidGeoFenceEnteredCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
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

        final String js = String.format("javascript:SignalPG._nativeDidGeoFenceExitedCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
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

        final String js = String.format("javascript:SignalPG._nativeDidGeoFenceEnteredCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
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

        final String js = String.format("javascript:SignalPG._nativeDidStatusChangeCB('%i')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
    }

    /**
     * Called when the sdk finishes registering with the Sonic servers
     *
     * @param success whether or not signal succeeded to register
     */
    @Override
    public void didCompleteRegistration(boolean success) {
        final String js = String.format("javascript:SignalPG._nativeDidCompleteRegistrationCB('%b')", success);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
    }

    /**
     * Called when the sdk updates configuration
     * @param changed whether or not a new configuration was retrieved
     */
    @Override
    public void didUpdateConfiguration(boolean changed) {
        final String js = String.format("javascript:SignalPG._nativeDidUpdateConfigurationCB('%b')", changed);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });
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

        final String js = String.format("javascript:SignalPG._nativeGetTagsForCodeCB('%s')", json);

        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.loadUrl(js);
            }
        });

        return null;
    }

    @Override
    public View getContentNavigatorRowView(View convertView, ViewGroup viewGroup, SignalActivation content) {
        return null;
    }

    @Override
    public void decorateContentNavigatorActivity(SignalContentNavigatorActivity activity) {
       // View headerView = activity.findViewById($PACKAGE_NAME.R.id.signal_content_navigator_header);
       // headerView.setBackgroundColor(0xFFFFFFFF);

    // TextView toastTitleView = (TextView) appearance.findViewById(resources.getIdentifier("toastTitle","id",packageName));
                        // toastTitleView.setText(toastTitle);
    }

    @Override
    public void decorateContentWebViewActivity(SignalContentWebViewActivity activity) {

    }

    @Override
    public JSONObject decorateCard(JSONObject object) {
        return null;
    }

    @Override
    public Intent decorateNotificationIntent(Intent intent) {
        return null;
    }

    @Override
    public Notification decorateNotification(Notification notification) {
        return null;
    }

    @Override
    public int getNotificationIconResourceId() {
        return 0;
//        return R.drawable.signal_notification_icon;
    }

    @Override
    public Boolean canActivateContent(SignalActivation activation) {
        return null;
    }

    @Override
    public Boolean canDeleteListCard(SignalActivation var1) {
        return null;
    }

    @Override
    public String willExpandSplashCard(SignalActivation var1, String var2) {
        return null;
    }

    @Override
    public void didCloseSplashCard(SignalActivation var1, boolean var2) {

    }

}
