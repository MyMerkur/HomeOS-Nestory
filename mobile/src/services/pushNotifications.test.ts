import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { apiClient } from './apiClient';
import {
  registerForPushNotifications,
  subscribeToForegroundMessages,
  unregisterPushToken,
} from './pushNotifications';

jest.mock('./apiClient', () => ({
  apiClient: { post: jest.fn(() => Promise.resolve()), delete: jest.fn(() => Promise.resolve()) },
}));

describe('pushNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerForPushNotifications', () => {
    it('registers the FCM token with the backend when permission is granted', async () => {
      (messaging().requestPermission as jest.Mock).mockResolvedValue(
        messaging.AuthorizationStatus.AUTHORIZED,
      );
      (messaging().getToken as jest.Mock).mockResolvedValue('token-123');

      await registerForPushNotifications();

      expect(apiClient.post).toHaveBeenCalledWith('/users/me/push-tokens', {
        token: 'token-123',
        platform: expect.any(String),
      });
    });

    it('does not register a token when permission is denied', async () => {
      (messaging().requestPermission as jest.Mock).mockResolvedValue(
        messaging.AuthorizationStatus.DENIED,
      );

      await registerForPushNotifications();

      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('unregisterPushToken', () => {
    it('removes the current token from the backend', async () => {
      (messaging().getToken as jest.Mock).mockResolvedValue('token-123');

      await unregisterPushToken();

      expect(apiClient.delete).toHaveBeenCalledWith('/users/me/push-tokens/token-123');
    });

    it('does not throw when the removal request fails', async () => {
      (messaging().getToken as jest.Mock).mockResolvedValue('token-123');
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error('network error'));

      await expect(unregisterPushToken()).resolves.toBeUndefined();
    });
  });

  describe('subscribeToForegroundMessages', () => {
    it('displays an incoming foreground message via notifee', async () => {
      let handler: (message: unknown) => Promise<void> = async () => undefined;
      (messaging().onMessage as jest.Mock).mockImplementation((callback) => {
        handler = callback;
        return jest.fn();
      });

      subscribeToForegroundMessages();
      await handler({ notification: { title: 'Hi', body: 'There' } });

      expect(notifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Hi', body: 'There' }),
      );
    });
  });
});
