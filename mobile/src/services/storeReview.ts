import InAppReview from 'react-native-in-app-review';
import { incrementAppOpenCount, hasRequestedReview, markReviewRequested } from './storeReviewStorage';
import { recordError } from './crashReporting';

// Bir kullanıcının uygulamayı gerçekten kullandığından emin olmak için
// birkaç açılış bekleniyor — ilk açılışta değerlendirme istemek kötü UX.
const APP_OPEN_THRESHOLD = 3;

export async function maybeRequestReview(): Promise<void> {
  try {
    const alreadyRequested = await hasRequestedReview();
    if (alreadyRequested) return;

    const openCount = await incrementAppOpenCount();
    if (openCount < APP_OPEN_THRESHOLD) return;

    if (!InAppReview.isAvailable()) return;

    await InAppReview.RequestInAppReview();
    await markReviewRequested();
  } catch (error) {
    // Değerlendirme isteği asla kullanıcı akışını bozmamalı — sessizce logla.
    recordError(error, 'storeReview.maybeRequestReview');
  }
}
