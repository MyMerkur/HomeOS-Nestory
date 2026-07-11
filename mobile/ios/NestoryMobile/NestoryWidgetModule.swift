import Foundation
import WidgetKit

// Bridges dashboard summary data from JS into the shared App Group storage
// the WidgetKit extension (NestoryWidgetExtension/NestoryWidgetBundle.swift)
// reads from. The widget has no network/auth access of its own — it only
// ever shows the last snapshot the app wrote. WidgetCenter is Swift-only
// (no Objective-C header), which is why this module is Swift rather than
// the Objective-C most of this app's other native modules use.
@objc(NestoryWidgetModule)
class NestoryWidgetModule: NSObject {
  private let appGroupId = "group.com.nestoryhomekit.app"
  private let widgetDataKey = "widget_data"

  @objc
  func writeSnapshot(_ json: String) {
    let defaults = UserDefaults(suiteName: appGroupId)
    defaults?.set(json, forKey: widgetDataKey)

    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
