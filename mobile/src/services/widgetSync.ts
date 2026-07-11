import { NativeModules, Platform } from 'react-native';
import { recordError } from './crashReporting';

// The home screen widget (Android Glance / iOS WidgetKit — see
// android/.../NestoryWidget.kt and ios/NestoryWidgetExtension/) has no
// network or auth access of its own. This is the only way it gets data:
// a small snapshot written here every time the dashboard loads
// successfully, read by the native widget straight from shared storage.
type WidgetSnapshot = {
  expiringToday: number;
  upcomingItems: { name: string }[];
};

type NestoryWidgetNativeModule = {
  writeSnapshot(json: string): void;
};

function getNativeModule(): NestoryWidgetNativeModule | null {
  const nativeModule = (NativeModules as Record<string, unknown>).NestoryWidget as
    | NestoryWidgetNativeModule
    | undefined;
  return nativeModule ?? null;
}

export function syncWidgetData(snapshot: WidgetSnapshot): void {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

  const nativeModule = getNativeModule();
  if (!nativeModule) return;

  try {
    nativeModule.writeSnapshot(
      JSON.stringify({
        expiringToday: snapshot.expiringToday,
        upcomingItems: snapshot.upcomingItems.slice(0, 3),
      }),
    );
  } catch (error) {
    recordError(error, 'widgetSync.syncWidgetData');
  }
}
