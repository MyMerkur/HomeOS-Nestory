import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasSeenOnboarding, markOnboardingSeen } from './onboardingStorage';

describe('onboardingStorage', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('reports false when onboarding has never been seen', async () => {
    expect(await hasSeenOnboarding()).toBe(false);
  });

  it('reports true after being marked as seen', async () => {
    await markOnboardingSeen();
    expect(await hasSeenOnboarding()).toBe(true);
  });
});
