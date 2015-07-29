# sn-phonegap

sn-phonegap is the PhoneGap plugin for the Signal360 SDK for iOS and Android.

## PhoneGap CLI
[PhoneGap CLI Install Guide](http://docs.phonegap.com/getting-started/1-install-phonegap/cli/)

The PhoneGap CLI provides a command line interface for creating PhoneGap apps as an alternative to using the PhoneGap Desktop App for those who prefer working at the command line. The PhoneGap CLI has additional features over the PhoneGap Desktop for building, running, and packaging your PhoneGap applications on multiple platforms. If you're comfortable using a CLI this option may be best going forward.

### Quick Start
To download and install the PhoneGap CLI:
```sh
# OS X / Linux
$ sudo npm install -g phonegap@latest
```

You will also need to install [node.js](nodejs.org)

### Getting Started
```sh
$ phonegap create my-app    # create a PhoneGap project
$ cd my-app                 # change to project directory
$ phonegap run ios          # build and install the app to iOS
$ phonegap run android      # build and install the app to Android

# create a PhoneGap project using the PhoneGap 'hello world' template
$ phonegap create my-ios-hello-world --template hello-world
$ phonegap template list    # see existing PhoneGap standard templates
```

Additional CLI commands and getting started resources:

  - <http://phonegap.com/blog/2014/11/13/phonegap-cli-3-6-3/>
  - <https://github.com/phonegap/phonegap-cli>

## PhoneGap Plugin (sn-phonegap)
To install the Signal360 PhoneGap plugin in an new/existing app:

**1. Add the plugin**

**2. Modify either Signal.m (iOS) or SignalPG.java (Android)**

**3. Optional: Modify index.html**

**4. Run and build app**

### JS <-> Native
In signalpg.js, the **cordova.exec** function is used to define the following:

 - success callback (if necessary)
 - error callback (if necessary)
 - "native class" aka "service"
 - "native class method" aka "action"
 - arguments array to pass into native environment

####Example: JS Method (isBluetoothEnabled) in signalpg.js
```sh
isBluetoothEnabled: function () {
    # callback that is registered (see 'Register Callbacks' section below)
    var callback = this.isBluetoothEnabledCB;
    
  cordova.exec (function (bool) {
    if (callback) {
            callback.apply (this, [bool]);
        }
  }, null, "SignalPG", "isBluetoothEnabled", []);
},
```

More detail from the [Plugin Development Guide](https://cordova.apache.org/docs/en/5.0.0/guide_hybrid_plugins_index.md.html)

####How JS method call passes args to native environment
The plugin class (SignalPG) performs the 'action' (e.g., the native method, _isBluetoothEnabled_, is called with no parameters. Upon success, the JavaScript success callback method is called. In this case, the success callback named isBluetoothEnabledCB is called in the JS environment with the boolean return value as a parameter.

### Add/Remove Plugin
```sh
# first, cd into the project folder

$ phonegap plugin add <enter repo https address>
$ phonegap plugin list                        # shows the currently installed plugins
$ phonegap plugin remove <enter package name> # i.e., com.signal360.SignalPGPlugin
```

### iOS-specific Implementation
  - **Set appID manually in the 'pluginInitialize' method in SignalPG.m**
```sh
- (void) pluginInitialize {
    NSString *applicationGuid = @"<appId>";
    bool makeQuiet = false;

    [self commonInitTasks:applicationGuid];
}
```

### Android-specific Implementation
  - **Import R file of the application package in SignalPG.java**
```sh
# SignalPG.java
package com.signal360.plugin;

# add import statement below to SignalPG.java
import <full-package-name>.R;
```

  - **Set appID manually in the 'initialize' method in SignalPG.java**

```sh
public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    Context context = cordova.getActivity().getApplicationContext();

    # enter in your appID, assigned by Signal360, for your app
    String appID = "xxxxxxxxxxxxxxxxx";
    Signal.get().initialize(context, this, appID);
    SignalUI.get().initialize(context, this, R.class);
    Signal.get().start();
}
```
  - **Optional: customize the icon that appears on the left side of a Notification**
  
Include a R.drawable file in the resources (res) folder and reference the filename in getNotificationIconResourceId() in SignalPG.java.
        
```sh
public int getNotificationIconResourceId() {
    // personalize by returning your own icon at R.drawable.your_icon_file
    // ie return R.drawable.signal_notification_icon
    return 0;
}
```

### Note: Almost Done
At this point, the Signal360 SDK should be implemented and deliver content. 


#### Other Setup (Libraries/Frameworks, plugin.xml, signalpg.js)
You do not need to add signalpg.js in a script tag because it was already included due to the settings of plugin.xml

All the frameworks and library dependences you need for iOS and Android SDK do not have to be added manually, nor does the Android Manifest of the app need to be modified. That's all taken care of by plugin.xml. You may want to make sure the versions of the SDKs that are included with the plugin are the latest versions. If not, just ask us to update it.

```sh
src/ios/sdk
src/android/libs
src/android/jniLibs
src/android/res
```

### Optional: Register Callbacks or Call Additional SDK Methods
#### Edit index.html or reference new JS file
Create an init() function within the script tags that is called either when the device is ready or loaded. One way to do it is to add an **onload** parameter to the **body** element in the index.html file:

```sh
<body onload="init()">

# within script tag (or separate js file), add the init function
<script type="text/javascript">
    function init() {
        var callback = function(json) {
            alert(json);
        };

        SignalPG.registerDidHearCodeCB(callback); # register delegate/callback method in JS
    }
</script>
```
#### Available Callbacks to Register
Associated JS helper method in italics
 - isOn (_registerIsOnCB_)
 - isBluetoothEnabled (_registerIsBluetoothEnabledCB_)
 - isUserOptedOut (_registerIsUserOptedOutCB_)
 - isAdvertisingIdentifierEnabled (_registerIsAdvertisingIdentifierEnabledCB_)
 - allActiveContent (_registerAllActiveContentCB_)
 - didHearCode (_registerDidHearCodeCB_)
 - didReceiveActivations (_registerDidReceiveActivationsCB_)
 - didStatusChange (_registerDidStatusChangeCB_)
 - didGeoFenceEntered (_registerDidGeoFenceEnteredCB_)
 - didGeoFenceExited (_registerDidGeoFenceExitedCB_)
 - didGeoFencesUpdated (_registerDidGeoFencesUpdatedCB_)
 - didCompleteRegistration (_registerDidCompleteRegistrationCB_)
 - didUpdateConfiguration (_registerDidUpdateConfigurationCB_)
 - getTagsForCode (_registerGetTagsForCodeCB_)

### Run/Build PhoneGap App
```sh
# first, cd into the project folder

# check to see plugin installed
$ phonegap plugin list                        # shows the currently installed plugins

$ phonegap build android
$ phonegap run android

# for ios, you can use xcode to build and run
# for android, you can't use android studio to debug build
```

### Addendum: PhoneGap Plugin Mechanics and Plugin.xml 
```sh
plugin.xml
src/ios/sdk             # SignalUI framework here
src/android/libs        # Android jars here
src/android/jniLibs
src/android/res         # _layout.xml files
```

Plugin.xml is the config file that populates the iOS and/or Android app with the necessary libraries/frameworks and resources to run properly. 

#### Updating the Plugin
If there is a update to included libraries or files included in Signal SDK or the SDK itself (ie, the jar or SignalUI.framework) that is included with the plugin, the filenames referenced in plugin.xml **must be updated**.

[Cordova plugin specs and documentation](https://cordova.apache.org/docs/en/4.0.0/plugin_ref_spec.md.html)


## Additional Reference
  - [Official Android PhoneGap Platform Guide](http://docs.phonegap.com/en/4.0.0/guide_platforms_android_index.md.html)
  - [Official iOS PhoneGap Platform Guide](http://docs.phonegap.com/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)
