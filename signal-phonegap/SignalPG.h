//
//  SignalPG.h
//  signal-phonegap
//
//  Created by Waine Tam on 6/15/15.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

#import "SignalUI.framework/Headers/SignalShared.h"
#import "SignalUI.framework/Headers/SignalUI.h"
#import "SignalUI.framework/Headers/SignalActivation.h"
#import "SignalUI.framework/Headers/SignalAudioCodeHeard.h"
#import "SignalUI.framework/Headers/SignalBluetoothCodeHeard.h"
#import "SignalUI.framework/Headers/SignalCodeHeard.h"
#import "SignalUI.framework/Headers/SignalConstantsUI.h"
#import "SignalUI.framework/Headers/SignalContentSplitViewController.h"
#import "SignalUI.framework/Headers/SignalContentTableViewCell.h"
#import "SignalUI.framework/Headers/SignalEvent.h"
#import "SignalUI.framework/Headers/SignalHistoricalData.h"
#import "SignalUI.framework/Headers/SignalIndicatorView.h"
#import "SignalUI.framework/Headers/SignalLocation.h"


@interface SignalPG : CDVPlugin <SignalDelegate>

- (void) initialize:(CDVInvokedUrlCommand *)command;

- (void) start:(CDVInvokedUrlCommand *)command;

- (void) stop:(CDVInvokedUrlCommand *)command;

/**
 * Called to determine if start has been called
 * @return BOOL whether or not start has been called
 */
- (void) isOn:(CDVInvokedUrlCommand *)command;

/**
 * Called to determine if Bluetooth is enabled on the device
 * @return BOOL whether or not Bluetooth is Enabled
 */
- (void) isBluetoothEnabled:(CDVInvokedUrlCommand *)command;

- (void) userOptOut:(CDVInvokedUrlCommand *)command;

- (void) userOptIn:(CDVInvokedUrlCommand *)command;

/**
 * @return BOOL whether or not user has opted out
 */
- (void) isUserOptedOut:(CDVInvokedUrlCommand *)command;

- (void) enableAdvertisingIdentifier:(CDVInvokedUrlCommand *)command;

- (void) disableAdvertisingIdentifier:(CDVInvokedUrlCommand *)command;

/**
 * @return BOOL whether or not advertising identifier is enabled
 */
- (BOOL) isAdvertisingIdentifierEnabled:(CDVInvokedUrlCommand *)command;


//- (void) setCustomerIdentifier: (NSString *) customerIdentifier;
- (void) setCustomerIdentifier:(CDVInvokedUrlCommand *)command;

- (void) reset:(CDVInvokedUrlCommand *)command;

//- (void) checkConfig:(void (^)(SignalFetchResult))completionHandler; TBD
- (void) checkConfig:(CDVInvokedUrlCommand *)command;

- (void) getActivationsWithCodeHeard:(CDVInvokedUrlCommand *)command;

/**
 * @return NSArray* All active activations
 */
- (void) allActiveContent:(CDVInvokedUrlCommand *)command;


// SignalDelegate methods below
/**
 * This is called when a signal is heard and provides a code heard object
 *
 * NOTE: this does not mean content is available
 *
 * @param signal - the configured running instance of signal
 * @param codeHeard instance of the SignalCodeHeard
 *
 * @return whether or not you are interested in receiving content for this signal, it is the implementers responsibility for throttling
 *
 */
//- (BOOL) signal: (Signal *)signal didHearCode: (SignalCodeHeard *) code;
//- (void) didHearCode:(CDVInvokedUrlCommand *)command;


/**
 * Did receive activations is called after URL#signal:didHearCode:withTimeInterval returns YES.
 *
 * The server is then queried (or offline content prepared) and activations delivered
 *
 * @param signal - the configured running instance of signal
 * @param activations instances of SignalActivation that contain, delivery time, content, etc
 */
//- (void) signal: (Signal *)signal didReceiveActivations: (NSArray *) activations;

/**
 * When offline content is receive and cached internally (signal only caches the raw data)
 * it is then passed to the delegate to have the implementing system cache whatever data is required.
 *
 * @param signal - the configured running instance of signal
 * @param activations is an array of SignalActivation that needs to have application level caching completed
 */
//- (void) signal: (Signal *)signal cacheOfflineContent: (NSArray *) contents;

/**
 * When the SDK status changes, this method is executed with the new status
 *
 * @param signal - the configured running instance of signal
 * @param status new status of the SDK
 */
- (void) signal: (Signal *)signal didStatusChange: (SignalSdkStatus) status;

/**
 * When the application has location enabled, and the user has broken a geo-fence this will be called with that location.
 * It is not guaranteed that this is called when a user has entered a geo fence.
 *
 * @param signal - the configured running instance of signal
 * @param location of the geo fence entered
 */
- (void) signal: (Signal *)signal didGeoFenceEntered: (SignalLocation *) location;

/**
 * When the application has location enabled and the user has exited a geo-fence this will be called with that location.
 * It is not guaranteed that this is called for each geo fence enter event.  For example the user turned off device while inside
 * a geo fence.
 *
 * @param signal - the configured running instance of signal
 * @param location of the geo fence exited
 */
- (void) signal: (Signal *)signal didGeoFenceExited: (SignalLocation *) location;

/**
 * When the application has location enabled and sdk has determined that an updated set of locations should be monitored.
 *
 * @param signal - the configured running instance of signal
 * @param locations of the geo fences to monitor
 */
- (void) signal: (Signal *)signal didGeoFencesUpdated: (NSArray *) locations;

/**
 * When the application finishes registering
 *
 * @param signal - the configured running instance of signal
 * @param success whether or not sdk succeeded to register
 */
- (void) signal: (Signal *)signal didCompleteRegistration:(BOOL)success;

/**
 * When the application finishes configuring
 *
 * @param signal - the configured running instance of signal
 * @param changed whether or not configuration changed
 */
- (void) signal: (Signal *)signal didUpdateConfiguration:(BOOL)changed;

/**
 * Get tags for code
 *
 * @param signal - the configured running instance of signal
 * @param code code for which to provide tags
 */
- (NSDictionary*) signal: (Signal *)signal getTagsForCode:(SignalCodeHeard*)code;



@end
