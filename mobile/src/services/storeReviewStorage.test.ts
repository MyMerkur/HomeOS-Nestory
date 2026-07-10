import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasRequestedReview, incrementAppOpenCount, markReviewRequested } from './storeReviewStorage';

describe('storeReviewStorage', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts the app open count at 1', async () => {
    expect(await incrementAppOpenCount()).toBe(1);
  });

  it('increments the app open count on each call', async () => {
    await incrementAppOpenCount();
    await incrementAppOpenCount();
    expect(await incrementAppOpenCount()).toBe(3);
  });

  it('reports false when the review has never been requested', async () => {
    expect(await hasRequestedReview()).toBe(false);
  });

  it('reports true after being marked as requested', async () => {
    await markReviewRequested();
    expect(await hasRequestedReview()).toBe(true);
  });
});
