var SignalPG = {

	isOnCB: null,

	isBluetoothEnabledCB: null,

	isUserOptedOutCB: null,

	isAdvertisingIdentifierEnabledCB: null,

	allActiveContentCB: null,

	didHearCodeCB: null, // delegate method

	didReceiveActivationsCB: null, // delegate method

	didStatusChangeCB: null, // delegate method; 0 = SignalSdkStatusNotInitialized, 1 = SignalSdkStatusDisabled, 2 = SignalSdkStatusTrial, 3 = SignalSdkStatusEnabled

	didGeoFenceEnteredCB: null, // delegate method

	didGeoFenceExitedCB: null, // delegate method

	didGeoFencesUpdatedCB: null, // delegate method

	didCompleteRegistrationCB: null, // delegate method

	didUpdateConfigurationCB: null, // delegate method

	getTagsForCodeCB: null, // delegate method

	/**
	 * Initialize the sdk with the application guid and a delegate that will receive all callbacks.
	 *
	 * @param applicationGuid unique identifier provided by Signal360 CMS
	 * @param option boolean for sdk to prevent os popups
	 */
	initialize: function (applicationGuid, option) {
		var failureCallback = function(message) {
	    console.log("Could not initialize: " + message);
	  };

		if (applicationGuid && typeof applicationGuid === "string") {
			if (option && typeof option === "boolean") {
				cordova.exec (null, failureCallback, "SignalPG", "initialize", [applicationGuid, option]);
			} else {
				cordova.exec (null, failureCallback, "SignalPG", "initialize", [applicationGuid, false]);
			}
		}
	},

	/**
	 * Start, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 */
	start: function () {
		var failureCallback = function(message) {
	    console.log("Could not start: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "start", []);
	},

	/**
	 * Stop, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 */
	stop: function () {
		var failureCallback = function(message) {
	    console.log("Could not stop: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "stop", []);
	},

	/**
	 * Called to determine if start has been called
	 * @return BOOL whether or not start has been called
	 */
	isOn: function () {
		var failureCallback = function(message) {
	    console.log("isOn error: " + message);
	  };

		var successCallback = this.isOnCB;
		cordova.exec (function (bool) {
			if (successCallback) {
        successCallback.apply (this, [bool]);
      }
		}, null, "SignalPG", "isOn", []);
	},

	/**
   * Provide function callback for isOn.
   * You need to pass a callback function to receive the boolean return value.
   *
   * @param {function} callback function to receive the boolean value
   *
   * @example function isOnCB(bool) {
   *    alert(bool);
   *  }
   *  SignalPG.registerIsOnCB(isOnCB);
   *  SignalPG.isOn();
   */
  registerIsOnCB: function (callback) {
    if (typeof callback === "function") {
      this.isOnCB = callback;
    }
  },

	/**
	 * Called to determine if Bluetooth is enabled on the device
	 * @return BOOL whether or not Bluetooth is Enabled
	 */
	isBluetoothEnabled: function () {
		var failureCallback = function(message) {
	    console.log("isBluetoothEnabled error: " + message);
	  };

		var successCallback = this.isBluetoothEnabledCB;
		cordova.exec (function (bool) {
			if (successCallback) {
        successCallback.apply (this, [bool]);
      }
		}, failureCallback, "SignalPG", "isBluetoothEnabled", []);
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
   *  SignalPG.isBluetoothEnabled(); // then call the method
   */
  registerIsBluetoothEnabledCB: function (callback) {
    if (typeof callback === "function") {
      this.isBluetoothEnabledCB = callback;
    }
  },

	/**
	 * User opts out
	 */
	userOptOut: function () {
		var failureCallback = function(message) {
	    console.log("userOptOut error: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "userOptOut", []);
	},

	/**
	 * User opts in
	 */
	userOptIn: function () {
		var failureCallback = function(message) {
	    console.log("userOptIn error: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "userOptIn", []);
	},

	/**
	 * @return BOOL whether or not user has opted out
	 */
	isUserOptedOut: function () {
		var failureCallback = function(message) {
	    console.log("isUserOptedOut error: " + message);
	  };

		var successCallback = this.isUserOptedOutCB;
		cordova.exec (function (bool) {
			if (successCallback) {
        successCallback.apply (this, [bool]);
      }
		}, failureCallback, "SignalPG", "isUserOptedOut", []);
	},

	/**
   * Provide function callback for isUserOptedOut.
   * You need to pass a callback function to receive the boolean return value.
   *
   * @param {function} callback function to receive the boolean value
   */
  registerIsUserOptedOutCB: function (callback) {
    if (typeof callback === "function") {
      this.isUserOptedOutCB = callback;
    }
  },

	/**
	 * Enable advertising identifier
	 */
	enableAdvertisingIdentifier: function () {
		var failureCallback = function(message) {
	    console.log("Could not enableAdvertisingIdentifier: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "enableAdvertisingIdentifier", []);
	},

	/**
	 * Disable advertising identifier
	 */
	disableAdvertisingIdentifier: function () {
		var failureCallback = function(message) {
	    console.log("Could not disableAdvertisingIdentifier: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "disableAdvertisingIdentifier", []);
	},

	/**
	 * @return BOOL whether or not advertising identifier is enabled
	 */
	isAdvertisingIdentifierEnabled: function() {
		var failureCallback = function(message) {
	    console.log("isAdvertisingIdentifierEnabled error: " + message);
	  };

		var successCallback = this.isAdvertisingIdentifierEnabledCB;
		cordova.exec (function (bool) {
			if (successCallback) {
        successCallback.apply (this, [bool]);
      }
		}, failureCallback, "SignalPG", "isAdvertisingIdentifierEnabled", []);
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
   *  SignalPG.isAdvertisingIdentifierEnabled() // then call the method
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
		var failureCallback = function(message) {
	    console.log("Could not setCustomerIdentifier: " + message);
	  };

		if (customerIdentifier && typeof customerIdentifier === "string") {
			cordova.exec (null, failureCallback, "SignalPG", "setCustomerIdentifier", [customerIdentifier]);
		}
	},

	/**
	 * Reset all content, activations, cached content, etc
	 */
	reset: function () {
		var failureCallback = function(message) {
	    console.log("Could not reset: " + message);
	  };

		cordova.exec (null, failureCallback, "SignalPG", "reset", []);
	},

	/**
	 * Simulate code heard
	 *
	 * @param integer code
	 */
	getActivationsWithCodeHeard: function (code) {
		var failureCallback = function(message) {
	    console.log("Could not getActivationsWithCodeHeard: " + message);
	  };

		if (code && typeof code === "number") {
			cordova.exec (null, failureCallback, "SignalPG", "getActivationsWithCodeHeard", [code]);
		}
	},

	/**
	 * All active activations
	 * @return Array of <SignalActivation>
	 */
	allActiveContent: function () {
		var failureCallback = function(message) {
	    console.log("allActiveContent error: " + message);
	  };

		var successCallback = this.allActiveContentCB;
		cordova.exec (function (json) {
			if (successCallback) {
        successCallback.apply (this, [json]);
      }
		}, failureCallback, "SignalPG", "allActiveContent", []);
	},

	/**
	 * Set tags for advanced targeting
	 * @param object with key-value pairs of tags
	 */
	setTags: function (obj) {
		var failureCallback = function(message) {
	    console.log("Could not setTags: " + message);
	  };

		if (obj && typeof obj === "object") {
			cordova.exec (null, failureCallback, "SignalPG", "setTags", [obj]);
		}
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
   *  SignalPG.allActiveContent(); // then call the method
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
	},

	// helper methods to set the callbacks
	registerDidHearCodeCB: function (callback) {
    if (typeof callback === "function") {
      this.didHearCodeCB = callback;
    }
  },

	registerDidReceiveActivationsCB: function (callback) {
    if (typeof callback === "function") {
      this.didReceiveActivationsCB = callback;
    }
  },

	registerDidStatusChangeCB: function (callback) {
    if (typeof callback === "function") {
      this.didStatusChangeCB = callback;
    }
  },

	registerDidGeoFenceEnteredCB: function (callback) {
    if (typeof callback === "function") {
      this.didGeoFenceEnteredCB = callback;
    }
  },

	registerDidGeoFenceExitedCB: function (callback) {
    if (typeof callback === "function") {
      this.didGeoFenceExitedCB = callback;
    }
  },

	registerDidGeoFencesUpdatedCB: function (callback) {
    if (typeof callback === "function") {
      this.didGeoFencesUpdatedCB = callback;
    }
  },

  registerDidCompleteRegistrationCB: function (callback) {
    if (typeof callback === "function") {
      this.didCompleteRegistrationCB = callback;
    }
  },

  registerDidUpdateConfigurationCB: function (callback) {
    if (typeof callback === "function") {
      this.didUpdateConfigurationCB = callback;
    }
  },

	registerGetTagsForCodeCB: function (callback) {
    if (typeof callback === "function") {
      this.getTagsForCodeCB = callback;
    }
  }
}

module.exports = SignalPG;
