import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupportedLanguage, type SupportedLanguage } from '../i18n/languages';

const LANGUAGE_KEY = 'homeos.language';

export async function getStoredLanguage(): Promise<SupportedLanguage | null> {
  const value = await AsyncStorage.getItem(LANGUAGE_KEY);
  return value && isSupportedLanguage(value) ? value : null;
}

export async function setStoredLanguage(language: SupportedLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
}
