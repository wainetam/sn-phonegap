var SignalPG = {
	// delegate method callbacks to register, if desired
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
	 * @param {Function} successCallback: a callback function on success
	 */
	initialize: function (applicationGuid, option, successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not initialize: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		if (applicationGuid && typeof applicationGuid === "string") {
			if (option && typeof option === "boolean") {
				cordova.exec (successCallback, failureCallback, "SignalPG", "initialize", [applicationGuid, option]);
			} else {
				cordova.exec (successCallback, failureCallback, "SignalPG", "initialize", [applicationGuid, false]);
			}
		}
	},

	/**
	 * Start, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 * @param {Function} successCallback: a callback function on success
	 */
	start: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not start: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "start", []);
	},

	/**
	 * Stop, this is for both Bluetooth and Audio. If you are interested in one or the other this can be configured via the CMS.
	 * @param {Function} successCallback: a callback function on success; can be null
	 */
	stop: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not stop: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "stop", []);
	},

	/**
	 * Called to determine if start has been called
	 * @return BOOL whether or not start has been called
	 * @param {Function} successCallback: a callback function on success; should accept boolean; can be null
	 */
	isOn: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("isOn error: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "isOn", []);
	},

	/**
	 * Called to determine if Bluetooth is enabled on the device
	 * @return BOOL whether or not Bluetooth is Enabled
	 * @param {Function} successCallback: a callback function on success that should accept boolean
	 */
	isBluetoothEnabled: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("isBluetoothEnabled error: " + message);
	  };

		if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "isBluetoothEnabled", []);
	},

	/**
	 * User opts out
	 * @param {Function} successCallback: a callback function on success
	 */
	userOptOut: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("userOptOut error: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "userOptOut", []);
	},

	/**
	 * User opts in
	 * @param {Function} successCallback: a callback function on success
	 */
	userOptIn: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("userOptIn error: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "userOptIn", []);
	},

	/**
	 * @return BOOL whether or not user has opted out
	 * @param {Function} successCallback: a callback function on success that should accept boolean
	 */
	isUserOptedOut: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("isUserOptedOut error: " + message);
	  };

		// var successCallback = this.isUserOptedOutCB;
		if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "isUserOptedOut", []);
	},

	/**
	 * Enable advertising identifier
	 * @param {Function} successCallback: a callback function on success
	 */
	enableAdvertisingIdentifier: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not enableAdvertisingIdentifier: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "enableAdvertisingIdentifier", []);
	},

	/**
	 * Disable advertising identifier
	 * @param {Function} successCallback: a callback function on success
	 */
	disableAdvertisingIdentifier: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not disableAdvertisingIdentifier: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "disableAdvertisingIdentifier", []);
	},

	/**
	 * @return BOOL whether or not advertising identifier is enabled
	 * @param {Function} successCallback: a callback function on success that should accept boolean
	 */
	isAdvertisingIdentifierEnabled: function(successCallback) {
		var failureCallback = function(message) {
	    console.log("isAdvertisingIdentifierEnabled error: " + message);
	  };

		if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "isAdvertisingIdentifierEnabled", []);
	},

	/**
	 * This allows SDK integrator to pass in customer identifier
	 * @param {Function} successCallback: a callback function on success
	 * @param string customerIdentifier
	 */
	setCustomerIdentifier: function (customerIdentifier, successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not setCustomerIdentifier: " + message);
	  };

	 	if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		if (customerIdentifier && typeof customerIdentifier === "string") {
			cordova.exec (successCallback, failureCallback, "SignalPG", "setCustomerIdentifier", [customerIdentifier]);
		}
	},

	/**
	 * Reset all content, activations, cached content, etc
	 * @param {Function} successCallback: a callback function on success
	 */
	reset: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not reset: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "reset", []);
	},

	/**
	 * Simulate code heard
	 *
	 * @param integer code
	 * @param {Function} successCallback: a callback function on success
	 */
	getActivationsWithCodeHeard: function (code, successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not getActivationsWithCodeHeard: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		if (code && typeof code === "number") {
			cordova.exec (successCallback, failureCallback, "SignalPG", "getActivationsWithCodeHeard", [code]);
		}
	},

	/**
	 * All active activations
	 * @return Array of <SignalActivation>
	 * @param {Function} successCallback: a callback function on success that should accept json (array of SonicActivation objects)
	 */
	allActiveContent: function (successCallback) {
		var failureCallback = function(message) {
	    console.log("allActiveContent error: " + message);
	  };

		if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		cordova.exec (successCallback, failureCallback, "SignalPG", "allActiveContent", []);
	},

	/**
	 * Set tags for advanced targeting
	 * @param object with key-value pairs of tags
	 * @param {Function} successCallback: a callback function on success
	 */
	setTags: function (obj, successCallback) {
		var failureCallback = function(message) {
	    console.log("Could not setTags: " + message);
	  };

	  if (typeof successCallback !== "function") {
	  	successCallback = null;
	  };

		if (obj && typeof obj === "object") {
			cordova.exec (successCallback, failureCallback, "SignalPG", "setTags", [obj]);
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

	// helper methods to set the JS callbacks for delegate methods
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
