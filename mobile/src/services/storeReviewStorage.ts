import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_OPEN_COUNT_KEY = 'homeos.appOpenCount';
const REVIEW_REQUESTED_KEY = 'homeos.reviewRequested';

export async function incrementAppOpenCount(): Promise<number> {
  const current = Number((await AsyncStorage.getItem(APP_OPEN_COUNT_KEY)) ?? '0');
  const next = current + 1;
  await AsyncStorage.setItem(APP_OPEN_COUNT_KEY, String(next));
  return next;
}

export async function hasRequestedReview(): Promise<boolean> {
  return (await AsyncStorage.getItem(REVIEW_REQUESTED_KEY)) === 'true';
}

export async function markReviewRequested(): Promise<void> {
  await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
}
