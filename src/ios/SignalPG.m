//
//  SignalPG.m
//  signal-phonegap
//
//  Created by Waine Tam on 6/15/15.
//
//

#import "SignalPG.h"

@interface SignalPG()

@end

@implementation SignalPG

#pragma mark Signal methods for Cordova JS Bridge

// called by cordova automatically
- (void) pluginInitialize {
    NSString *applicationGuid = @"035af909-caee-455d-8640-d9b9c5f9e0b7";
    bool makeQuiet = false;

    [self commonInitTasks:applicationGuid];
}

// used for manual init
- (void) initialize:(CDVInvokedUrlCommand *)command {
    NSString *applicationGuid = [command.arguments objectAtIndex:0];
    bool makeQuiet = false;
    if([command.arguments count] > 1) {
        makeQuiet = [command argumentAtIndex:1 withDefault:nil];
    }
    
    [self commonInitTasks:applicationGuid];
};

- (void) commonInitTasks:(NSString *)applicationGuid {
    // setup location mgr
    self.locationManager = [[CLLocationManager alloc] init];
    if([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)] && [CLLocationManager authorizationStatus] == kCLAuthorizationStatusNotDetermined) {
        [self.locationManager requestAlwaysAuthorization];
    }
    
    // setup notifications
    if([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert) categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    }
    
    NSDictionary *defaults = [NSDictionary dictionaryWithObject:applicationGuid forKey:@"sonicApplicationGuid"];
    [[NSUserDefaults standardUserDefaults] registerDefaults:defaults];

    // NSUserDefaults *defaultsTags = [NSUserDefaults standardUserDefaults];
    // [self setTags:[defaultsTags objectForKey:@"tags"]];

    [[SignalUI sharedInstance] initializeWithDelegate:(id<SignalUIDelegate>)self];
    [[Signal sharedInstance] initializeWithApplicationGUID:applicationGuid andDelegate:(id<SignalDelegate>)self];
    [[Signal sharedInstance] start];
}

- (void) start:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [[Signal sharedInstance] start];
    }];
}

- (void) stop:(CDVInvokedUrlCommand *)command {
    [[Signal sharedInstance] stop];
}

/**
 * Called to determine if start has been called
 * @return BOOL whether or not start has been called
 */
//- (void) isOn:(CDVInvokedUrlCommand *)command {
//    BOOL on = [[Signal sharedInstance] isOn];
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:on];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//};

/**
 * Called to determine if Bluetooth is enabled on the device
 * @return BOOL whether or not Bluetooth is Enabled
 */
- (void) isBluetoothEnabled:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        BOOL enabled = [[Signal sharedInstance] isBluetoothEnabled];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:enabled];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

//- (void) userOptOut:(CDVInvokedUrlCommand *)command {
//    [[Signal sharedInstance] userOptOut];
//}
//
//- (void) userOptIn:(CDVInvokedUrlCommand *)command {
//    [[Signal sharedInstance] userOptIn];
//}

/**
 * @return BOOL whether or not user has opted out
 */
//- (void) isUserOptedOut:(CDVInvokedUrlCommand *)command {
//    BOOL *optedOut = [[Signal sharedInstance] isUserOptedOut];
//    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:optedOut];
//    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
//}

//- (void) enableAdvertisingIdentifier:(CDVInvokedUrlCommand *)command {
//    [[Signal sharedInstance] enableAdvertisingIdentifier];
//}
//
//- (void) disableAdvertisingIdentifier:(CDVInvokedUrlCommand *)command {
//    [[Signal sharedInstance] disableAdvertisingIdentifier];
//}



/**
 * @return BOOL whether or not advertising identifier is enabled
 */
- (void) isAdvertisingIdentifierEnabled:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        BOOL enabled = [[Signal sharedInstance] isAdvertisingIdentifierEnabled];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:enabled];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void) setCustomerIdentifier:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSString *customerIdentifier = [command.arguments objectAtIndex:0];
        customerIdentifier = (([customerIdentifier isEqual: [NSNull null]] || customerIdentifier.length == 0) ? nil : customerIdentifier);
        if(customerIdentifier) {
            [[Signal sharedInstance] setCustomerIdentifier:customerIdentifier];
        }
    }];
}

- (void) reset:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        [[Signal sharedInstance] reset];
    }];
}

- (void) getActivationsWithCodeHeard:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        int beaconCode = (int)[command argumentAtIndex:0];
        
        if (beaconCode != 0) {
            [[Signal sharedInstance] getActivationsWithCodeHeard:[[SignalCodeHeard alloc] initWithBeaconCode:beaconCode]];
        }
    }];
}

/**
 * All active activations
 */

- (void) allActiveContent:(CDVInvokedUrlCommand *)command {
    [self.commandDelegate runInBackground:^{
        NSArray *content = [[Signal sharedInstance] allActiveContent];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:content];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

#pragma mark SignalDelegate Implementation
- (NSString *)serializeSignalCodeHeard:(SignalCodeHeard *)code {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    
    if ([code respondsToSelector:@selector(beaconCode)] && code.beaconCode) {
        [dict setObject:[NSNumber numberWithLong:code.beaconCode] forKey:@"beaconCode"];
    }

    if ([code respondsToSelector:@selector(timeCodeHeard)] && code.timeCodeHeard) {
        [dict setObject:[NSNumber numberWithLong:code.timeCodeHeard] forKey:@"timeCodeHeard"];
    }
    
    if ([code respondsToSelector:@selector(codesHeard)] && code.codesHeard) {
        [dict setObject:code.codesHeard forKey:@"codesHeard"];
    }
    
    NSError *error;
    NSData *jsonData;
    NSString *jsonString = nil;
    
    if ([NSJSONSerialization isValidJSONObject:dict]) {
        jsonData = [NSJSONSerialization dataWithJSONObject:[dict copy] options:0 error:&error];

        if (!jsonData) {
            NSLog(@"Got an error: %@", error);
            jsonString = [[NSString alloc] initWithString:[error localizedDescription]];
        } else {
            jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
    }
    return jsonString;
}

- (NSString *)serializeSignalActivation:(SignalActivation *)activation {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss ZZZ";
    
    if ([activation respondsToSelector:@selector(identifier)] && activation.identifier) {
        [dict setObject:[NSNumber numberWithLongLong:activation.identifier] forKey:@"identifier"];
    }

    if ([activation respondsToSelector:@selector(startDate)] && activation.startDate) {
        NSString* startDateString = [dateFormatter stringFromDate:activation.startDate];
        [dict setObject:startDateString forKey:@"startDate"];
    }
    
    if ([activation respondsToSelector:@selector(endDate)] && activation.endDate) {
        NSString* endDateString = [dateFormatter stringFromDate:activation.endDate];
        [dict setObject:endDateString forKey:@"endDate"];
    }
    
    if ([activation respondsToSelector:@selector(code)] && activation.code) {
        [dict setObject:[NSNumber numberWithLong:activation.code] forKey:@"code"];
    }
    
    if ([activation respondsToSelector:@selector(contentId)] && activation.contentId) {
        [dict setObject:[NSNumber numberWithLongLong:activation.contentId] forKey:@"contentId"];
    }
    
    if ([activation respondsToSelector:@selector(contentType)] && activation.contentType) {
        [dict setObject:activation.contentType forKey:@"contentType"];
    }
    
    if ([activation respondsToSelector:@selector(programId)] && activation.programId) {
        [dict setObject:[NSNumber numberWithLongLong:activation.programId] forKey:@"programId"];
    }
    
    if ([activation respondsToSelector:@selector(sequenceNumber)] && activation.sequenceNumber) {
        [dict setObject:[NSNumber numberWithLong:activation.sequenceNumber] forKey:@"sequenceNumber"];
    }
    
    if ([activation respondsToSelector:@selector(fields)] && activation.fields) {
        [dict setObject:activation.fields forKey:@"fields"];
    }

    NSError *error;
    NSData *jsonData;
    NSString *jsonString = nil;
    
    if ([NSJSONSerialization isValidJSONObject:dict]) {
        jsonData = [NSJSONSerialization dataWithJSONObject:[dict copy] options:0 error:&error];
        
        if (!jsonData) {
            NSLog(@"Got an error: %@", error);
            jsonString = [[NSString alloc] initWithString:[error localizedDescription]];
        } else {
            jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
    }
    return jsonString;

}

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
- (BOOL) signal: (Signal *)signal didHearCode: (SignalCodeHeard *) code {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;

        NSString *jsonString = [self serializeSignalCodeHeard:code];  // serialize SignalCodeHeard
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidHearCodeCB('%@');", jsonString];
        [self.commandDelegate evalJs:jsString];
    }];

    if (code) {
        return true;
    } else {
        return false;
    }
}


/**
 * Did receive activations is called after URL#signal:didHearCode:withTimeInterval returns YES.
 *
 * The server is then queried (or offline content prepared) and activations delivered
 *
 * @param signal - the configured running instance of signal
 * @param activations instances of SignalActivation that contain, delivery time, content, etc
 */
- (void) signal: (Signal *)signal didReceiveActivations: (NSArray *) activations {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        
        NSMutableArray *jsonArray = [[NSMutableArray alloc] init];
        
        for (SignalActivation *activation in activations) {
            NSString *json = [self serializeSignalActivation:activation];
            [jsonArray addObject:json];
        }
        
        NSError *error;
        NSData *jsonData;
        NSString *jsonString = nil;
        
        if ([NSJSONSerialization isValidJSONObject:jsonArray]) {
            jsonData = [NSJSONSerialization dataWithJSONObject:[jsonArray copy] options:0 error:&error];
            
            if (!jsonData) {
                NSLog(@"Got an error: %@", error);
                jsonString = [[NSString alloc] initWithString:[error localizedDescription]];
            } else {
                jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            }
        }
        
        NSLog(@"jsonData as string:\n%@", jsonString);
        
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidReceiveActivationsCB('%@');", jsonString];
        
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * When the SDK status changes, this method is executed with the new status
 *
 * @param signal - the configured running instance of signal
 * @param status new status of the SDK
 */
- (void) signal: (Signal *)signal didStatusChange: (SignalSdkStatus) status {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidStatusChangeCB('%ld');", (long)status]; // SignalSdkStatus is an NSInteger
        [self.commandDelegate evalJs:jsString];
    }];
}

- (NSString *)serializeSignalLocation:(SignalLocation *) location {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
    NSDateFormatter* dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss ZZZ";
    
    if ([location respondsToSelector:@selector(identifier)] && location.identifier) {
        [dict setObject:[NSNumber numberWithLongLong:location.identifier] forKey:@"identifier"];
    }
    
    if ([location respondsToSelector:@selector(name)] && location.name) {
        [dict setObject:location.name forKey:@"name"];
    }
    
    if ([location respondsToSelector:@selector(endTime)] && location.endTime) {
        NSString* endTimeString = [dateFormatter stringFromDate:location.endTime];
        [dict setObject:endTimeString forKey:@"endTime"];
    }
    
    if ([location respondsToSelector:@selector(startTime)] && location.startTime) {
        NSString* startTimeString = [dateFormatter stringFromDate:location.startTime];
        [dict setObject:startTimeString forKey:@"startTime"];
    }
    
    if ([location respondsToSelector:@selector(latitude)] && location.latitude) {
        [dict setObject:[NSNumber numberWithDouble:location.latitude] forKey:@"latitude"];
    }

    if ([location respondsToSelector:@selector(longitude)] && location.longitude) {
        [dict setObject:[NSNumber numberWithDouble:location.longitude] forKey:@"longitude"];
    }

    if ([location respondsToSelector:@selector(radius)] && location.radius) {
        [dict setObject:[NSNumber numberWithDouble:location.radius] forKey:@"radius"];
    }
    
    if ([location respondsToSelector:@selector(state)] && location.state) {
        [dict setObject:location.state forKey:@"state"];
    }
    
    if ([location respondsToSelector:@selector(programId)] && location.programId) {
        [dict setObject:[NSNumber numberWithLongLong:location.programId] forKey:@"programId"];
    }
    
    NSError *error;
    NSData *jsonData;
    NSString *jsonString = nil;
    
    if ([NSJSONSerialization isValidJSONObject:dict]) {
        jsonData = [NSJSONSerialization dataWithJSONObject:[dict copy] options:0 error:&error];
        
        if (!jsonData) {
            NSLog(@"Got an error: %@", error);
            jsonString = [[NSString alloc] initWithString:[error localizedDescription]];
        } else {
            jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        }
    }
    return jsonString;
}

/**
 * When the application has location enabled, and the user has broken a geo-fence this will be called with that location.
 * It is not guaranteed that this is called when a user has entered a geo fence.
 *
 * @param signal - the configured running instance of signal
 * @param location of the geo fence entered
 */
- (void) signal: (Signal *)signal didGeoFenceEntered: (SignalLocation *) location {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        NSString *jsonString = [self serializeSignalLocation:location];
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidGeoFenceEnteredCB('%@');", jsonString]; // serialize SignalLocation
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * When the application has location enabled and the user has exited a geo-fence this will be called with that location.
 * It is not guaranteed that this is called for each geo fence enter event.  For example the user turned off device while inside
 * a geo fence.
 *
 * @param signal - the configured running instance of signal
 * @param location of the geo fence exited
 */
- (void) signal: (Signal *)signal didGeoFenceExited: (SignalLocation *) location {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        NSString *jsonString = [self serializeSignalLocation:location];
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidGeoFenceExitedCB('%@');", jsonString]; // serialize SignalLocation
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * When the application has location enabled and sdk has determined that an updated set of locations should be monitored.
 *
 * @param signal - the configured running instance of signal
 * @param locations of the geo fences to monitor
 */
- (void) signal: (Signal *)signal didGeoFencesUpdated: (NSArray *) locations {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidGeoFencesUpdatedCB(%@);", [locations description]]; // stringified array of SignalLocation
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * When the application finishes registering
 *
 * @param signal - the configured running instance of signal
 * @param success whether or not sdk succeeded to register
 */
- (void) signal: (Signal *)signal didCompleteRegistration:(BOOL)success {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidCompleteRegistrationCB('%d');", success];
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * When the application finishes configuring
 *
 * @param signal - the configured running instance of signal
 * @param changed whether or not configuration changed
 */
- (void) signal: (Signal *)signal didUpdateConfiguration:(BOOL)changed {
    [self.commandDelegate runInBackground:^{
        NSString *jsString = nil;
        jsString = [NSString stringWithFormat:@"SignalPG._nativeDidUpdateConfigurationCB('%d');", changed];
        [self.commandDelegate evalJs:jsString];
    }];
}

/**
 * Get tags for code
 *
 * @param signal - the configured running instance of signal
 * @param code code for which to provide tags
 */
- (NSDictionary*) signal: (Signal *)signal getTagsForCode:(SignalCodeHeard*)code {
    [self.commandDelegate runInBackground:^{
        if (self.tagsForContent) {
            NSError *error;
            NSData *jsonData;
            NSString *jsonString = nil;

            if ([NSJSONSerialization isValidJSONObject:self.tagsForContent]) {
                jsonData = [NSJSONSerialization dataWithJSONObject:[self.tagsForContent copy] options:0 error:&error];

                if (!jsonData) {
                    NSLog(@"Got an error: %@", error);
                    jsonString = [[NSString alloc] initWithString:[error localizedDescription]];
                } else {
                    jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
                }
            }

            NSString *jsString = nil;
            jsString = [NSString stringWithFormat:@"SignalPG._nativeGetTagsForCodeCB('%@');", jsonString]; // serialize SignalCodeHeard
            [self.commandDelegate evalJs:jsString];
        }
    }];
    
    return nil;
}

- (void) setTags:(CDVInvokedUrlCommand *)command {
    NSMutableDictionary *tags = [command argumentAtIndex:0];

    self.tagsForContent = tags;
}

@end
