import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredThemeMode, setStoredThemeMode } from './themeStorage';

describe('themeStorage', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns null when nothing is stored', async () => {
    expect(await getStoredThemeMode()).toBeNull();
  });

  it('stores and retrieves a valid theme mode', async () => {
    await setStoredThemeMode('dark');
    expect(await getStoredThemeMode()).toBe('dark');
  });

  it('returns null for a corrupted/unknown stored value', async () => {
    await AsyncStorage.setItem('homeos.theme', 'sepia');
    expect(await getStoredThemeMode()).toBeNull();
  });
});
