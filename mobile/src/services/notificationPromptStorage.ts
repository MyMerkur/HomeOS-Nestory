import AsyncStorage from '@react-native-async-storage/async-storage';

const PROMPT_SHOWN_KEY = 'homeos.notificationPromptShown';

export async function hasShownNotificationPrompt(): Promise<boolean> {
  return (await AsyncStorage.getItem(PROMPT_SHOWN_KEY)) === 'true';
}

export async function markNotificationPromptShown(): Promise<void> {
  await AsyncStorage.setItem(PROMPT_SHOWN_KEY, 'true');
}
