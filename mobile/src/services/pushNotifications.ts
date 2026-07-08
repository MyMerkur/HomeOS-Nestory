import messaging, { type FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Platform } from 'react-native';
import { apiClient } from './apiClient';

const GENERAL_CHANNEL_ID = 'general-reminders';

async function displayRemoteMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
  if (!remoteMessage.notification) return;
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: { channelId: GENERAL_CHANNEL_ID },
  });
}

// FCM is only the transport — display is always handled by notifee so push
// and local reminders look and behave the same way to the user.
messaging().setBackgroundMessageHandler(displayRemoteMessage);

export async function registerForPushNotifications(): Promise<void> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (!enabled) return;

  const token = await messaging().getToken();
  await apiClient.post('/users/me/push-tokens', {
    token,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
  });
}

export async function unregisterPushToken(): Promise<void> {
  try {
    const token = await messaging().getToken();
    await apiClient.delete(`/users/me/push-tokens/${token}`);
  } catch {
    // Best-effort cleanup on logout — a stale server-side token just gets
    // pruned automatically the next time a push to it fails.
  }
}

export function subscribeToForegroundMessages(): () => void {
  return messaging().onMessage(displayRemoteMessage);
}
