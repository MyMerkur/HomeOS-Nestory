import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';
import { logger } from '../config/logger';
import { PushToken } from '../models/PushToken';

const INVALID_TOKEN_ERROR_CODES = new Set([
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
]);

// Read directly from process.env (rather than the parsed `env` singleton)
// so this can be toggled at runtime in tests without reloading every module
// that depends on `env` (which would also detach the test DB connection).
function getMessagingClient(): Messaging | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    return null;
  }
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getMessaging();
}

export async function registerPushToken(
  userId: string,
  token: string,
  platform: 'ios' | 'android',
): Promise<void> {
  await PushToken.findOneAndUpdate(
    { userId, token },
    { userId, token, platform },
    { upsert: true, new: true },
  );
}

export async function removePushToken(userId: string, token: string): Promise<void> {
  await PushToken.deleteOne({ userId, token });
}

export type PushNotificationInput = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

export async function sendToUser(userId: string, notification: PushNotificationInput): Promise<void> {
  const messaging = getMessagingClient();
  if (!messaging) {
    logger.warn({ userId }, 'Push notification skipped: FIREBASE_SERVICE_ACCOUNT is not configured');
    return;
  }

  const tokens = await PushToken.find({ userId });
  if (tokens.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    tokens.map((pushToken) =>
      messaging.send({
        token: pushToken.token,
        notification: { title: notification.title, body: notification.body },
        data: notification.data,
      }),
    ),
  );

  const staleTokenIds = tokens
    .filter((_, index) => {
      const result = results[index];
      return (
        result.status === 'rejected' &&
        INVALID_TOKEN_ERROR_CODES.has((result.reason as { code?: string })?.code ?? '')
      );
    })
    .map((pushToken) => pushToken._id);

  if (staleTokenIds.length > 0) {
    await PushToken.deleteMany({ _id: { $in: staleTokenIds } });
  }
}
