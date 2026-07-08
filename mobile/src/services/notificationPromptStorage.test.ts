import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasShownNotificationPrompt, markNotificationPromptShown } from './notificationPromptStorage';

describe('notificationPromptStorage', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('reports false when the prompt has never been shown', async () => {
    expect(await hasShownNotificationPrompt()).toBe(false);
  });

  it('reports true after being marked as shown', async () => {
    await markNotificationPromptShown();
    expect(await hasShownNotificationPrompt()).toBe(true);
  });
});
