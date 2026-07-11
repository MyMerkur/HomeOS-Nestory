#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NestoryWidgetModule, NSObject)

RCT_EXTERN_METHOD(writeSnapshot:(NSString *)json)

@end
