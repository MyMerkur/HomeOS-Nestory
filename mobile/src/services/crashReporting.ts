import crashlytics from '@react-native-firebase/crashlytics';

export async function initCrashReporting(): Promise<void> {
  await crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);
}

export function recordError(error: unknown, context?: string): void {
  const normalized = error instanceof Error ? error : new Error(String(error));
  if (context) crashlytics().log(context);
  crashlytics().recordError(normalized);
}

export function setCrashReportingUserId(userId: string | null): void {
  crashlytics().setUserId(userId ?? '');
}
