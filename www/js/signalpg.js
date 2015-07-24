var SignalPG = {

	isBluetoothEnabledCB: null,

	isAdvertisingIdentifierEnabledCB: null,

	allActiveContentCB: null,

	didHearCodeCB: null,

	didReceiveActivationsCB: null,

	didStatusChangeCB: null, // 0 = SignalSdkStatusNotInitialized, 1 = SignalSdkStatusDisabled, 2 = SignalSdkStatusTrial, 3 = SignalSdkStatusEnabled

	didGeoFenceEnteredCB: null,

	didGeoFenceExitedCB: null,

	didGeoFencesUpdatedCB: null,

	didCompleteRegistrationCB: null,

	didUpdateConfigurationCB: null,

	getTagsForCodeCB: null,

	/**
	 * Initialize the sdk with the application guid and a delegate that will receive all callbacks.
	 *
	 * @param applicationGuid unique identifier provided by Signal360 CMS
	 * @param option boolean for sdk to prevent os popups
	 */
	initialize: function (applicationGuid, option) { // tested
		if (applicationGuid && typeof applicationGuid === "string") {
			if (option && typeof option === "boolean") {
				cordova.exec (null, null, "SignalPG", "initialize", [applicationGuid, option]);
			} else {
				cordova.exec (null, null, "SignalPG", "initialize", [applicationGuid, false]);
			}
		}
	},

	/**
	 * Start, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 */
	start: function () {
		cordova.exec (null, null, "SignalPG", "start", []);
	},

	/**
	 * Stop, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 */
	stop: function () {
		cordova.exec (null, null, "SignalPG", "stop", []);
	},

	/**
	 * Called to determine if start has been called
	 * @return BOOL whether or not start has been called
	 */
//	isOn: function () {
//		cordova.exec (null, null, "SignalPG", "isOn", []);
//	},

	/**
	 * Called to determine if Bluetooth is enabled on the device
	 * @return BOOL whether or not Bluetooth is Enabled
	 */
	isBluetoothEnabled: function () {
		var callback = this.isBluetoothEnabledCB;
		cordova.exec (function (bool) {
			if (callback) {
        callback.apply (this, [bool]);
      }
		}, null, "SignalPG", "isBluetoothEnabled", []);
	},

	/**
   * Provide function callback for isBluetoothEnabled.
   * You need to pass a callback function to receive the boolean return value.
   *
   * @param {function} callback function to receive the boolean value
   *
   * @example function isBluetoothEnabledCB(bool) {
   *    alert(bool);
   *  }
   *  SignalPG.registerIsBluetoothEnabledCB(isBluetoothEnabledCB);
   */
  registerIsBluetoothEnabledCB: function (callback) {
    if (typeof callback === "function") {
      this.isBluetoothEnabledCB = callback;
    }
  },

	/**
	 * User opts out
	 */
//	userOptOut: function () {
//		cordova.exec (null, null, "SignalPG", "userOptOut", []);
//	},

	/**
	 * User opts in
	 */
//	userOptIn: function () {
//		cordova.exec (null, null, "SignalPG", "userOptIn", []);
//	},

	/**
	 * @return BOOL whether or not user has opted out
	 */
//	isUserOptedOut: function () {
//		cordova.exec (null, null, "SignalPG", "isUserOptedOut", []);
//	},

	/**
	 * Enable advertising identifier
	 */
//	enableAdvertisingIdentifier: function () {
//		cordova.exec (null, null, "SignalPG", "enableAdvertisingIdentifier", []);
//	},

	/**
	 * Disable advertising identifier
	 */
//	disableAdvertisingIdentifier: function () {
//		cordova.exec (null, null, "SignalPG", "disableAdvertisingIdentifier", []);
//	},

	/**
	 * @return BOOL whether or not advertising identifier is enabled
	 */
	isAdvertisingIdentifierEnabled: function() {
		var callback = this.isAdvertisingIdentifierEnabledCB;
		cordova.exec (function (bool) {
			if (callback) {
        callback.apply (this, [bool]);
      }
		}, null, "SignalPG", "isAdvertisingIdentifierEnabled", []);
	},

	/**
   * Provide function callback for isAdvertisingIdentifierEnabled.
   * You need to pass a callback function to receive the boolean return value.
   *
   * @param {function} callback function to receive the boolean value
   *
   * @example function isAdvertisingIdentifierEnabledCB(bool) {
   *    alert(bool);
   *  }
   *  SignalPG.registerIsAdvertisingIdentifierEnabledCB(isAdvertisingIdentifierEnabledCB);
   */
  registerIsAdvertisingIdentifierEnabledCB: function (callback) {
    if (typeof callback === "function") {
      this.isAdvertisingIdentifierEnabledCB = callback;
    }
  },

	/**
	 * This allows SDK integrator to pass in customer identifier
	 * @param string customerIdentifier
	 */
	setCustomerIdentifier: function (customerIdentifier) {
		if (customerIdentifier && typeof customerIdentifier === "string") {
			cordova.exec (null, null, "SignalPG", "setCustomerIdentifier", [customerIdentifier]);
		}
	},

	/**
	 * Reset all content, activations, cached content, etc
	 */
	reset: function () {
		cordova.exec (null, null, "SignalPG", "reset", []);
	},

	/**
	 * Manually update cached configuration
	 * @param block function (completionHandler) that accepts an integer<SignalFetchResult>
	 */
	checkConfig: function (completionHandler) {
		if (completionHandler && typeof completionHandler === "object") {
			cordova.exec (null, null, "SignalPG", "checkConfig", [completionHandler]);
		} else {
			cordova.exec (null, null, "SignalPG", "checkConfig", []);
		}
	},

	/**
	 * Simulate code heard
	 *
	 * @param integer code
	 */
	getActivationsWithCodeHeard: function (code) {
		if (code && typeof code === "number") {
			cordova.exec (null, null, "SignalPG", "getActivationsWithCodeHeard", [code]);
		}
	},

	/**
	 * All active activations
	 * @return Array of <SignalActivation>
	 */
	allActiveContent: function () {
		var callback = this.allActiveContentCB;
		cordova.exec (function (json) {
			console.log("JSON");
			console.log(json);
			if (callback) {
        callback.apply (this, [json]);
      }
		}, null, "SignalPG", "allActiveContent", []);
	},

	/**
   * Provide function callback for allActiveContent.
   * You need to pass a callback function to receive the array of Sonic Activation objects in JSON as its return value.
   *
   * @param {function} callback function to receive the array
   *
   * @example function allActiveContentCB(arr) {
   *    alert(arr);
   *  }
   *  SignalPG.registerAllActiveContentCB(allActiveContentCB);
   */
  registerAllActiveContentCB: function (callback) {
    if (typeof callback === "function") {
      this.allActiveContentCB = callback;
    }
  },

	// DELEGATE METHODS

	_nativeDidHearCodeCB: function (code) {
		if (this.didHearCodeCB) {
			this.didHearCodeCB.apply (null, [code]);
		}
	},

	_nativeDidReceiveActivationsCB: function (activations) {
		if (this.didReceiveActivationsCB) {
			this.didReceiveActivationsCB.apply (null, [activations]);
		}
	},

	_nativeDidStatusChangeCB: function (status) {
		if (this.didStatusChangeCB) {
			this.didStatusChangeCB.apply (null, [status]);
		}
	},

	_nativeDidGeoFenceEnteredCB: function (location) {
		if (this.didGeoFenceEnteredCB) {
			this.didGeoFenceEnteredCB.apply (null, [location]);
		}
	},

	_nativeDidGeoFenceExitedCB: function (location) {
		if (this.didGeoFenceExitedCB) {
			this.didGeoFenceExitedCB.apply (null, [location]);
		}
	},

	 _nativeDidGeoFencesUpdatedCB: function (location) {
		if (this.didGeoFencesUpdatedCB) {
			this.didGeoFencesUpdatedCB.apply (null, [location]);
		}
	 },

	_nativeDidCompleteRegistrationCB: function (success) {
		if (this.didCompleteRegistrationCB) {
			this.didCompleteRegistrationCB.apply (null, [success]);
		}
	},

	_nativeDidUpdateConfigurationCB: function (changed) {
		if (this.didUpdateConfigurationCB) {
			this.didUpdateConfigurationCB.apply (null, [changed]);
		}
	},	

	_nativeGetTagsForCodeCB: function (code) {
		if (this.getTagsForCodeCB) {
			this.getTagsForCodeCB.apply (null, [code]);
		}
	}
}

module.exports = SignalPG;
