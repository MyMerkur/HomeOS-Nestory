import AsyncStorage from '@react-native-async-storage/async-storage';

// MVP: AsyncStorage (düz depolama). İleride react-native-keychain'e geçilirse
// yalnızca bu dosya değişir (bkz. docs/ProjectDecisions.md).
const REFRESH_TOKEN_KEY = 'homeos.refreshToken';

export async function getStoredRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function setStoredRefreshToken(token: string): Promise<void> {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export async function clearStoredRefreshToken(): Promise<void> {
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}
