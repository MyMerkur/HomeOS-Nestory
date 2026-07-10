import InAppReview from 'react-native-in-app-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { maybeRequestReview } from './storeReview';
import { recordError } from './crashReporting';

jest.mock('./crashReporting', () => ({ recordError: jest.fn() }));

describe('maybeRequestReview', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (InAppReview.isAvailable as jest.Mock).mockReturnValue(true);
    (InAppReview.RequestInAppReview as jest.Mock).mockResolvedValue(true);
    await AsyncStorage.clear();
  });

  it('does not request a review before the open-count threshold is reached', async () => {
    await maybeRequestReview();
    await maybeRequestReview();

    expect(InAppReview.RequestInAppReview).not.toHaveBeenCalled();
  });

  it('requests a review once the open-count threshold is reached', async () => {
    await maybeRequestReview();
    await maybeRequestReview();
    await maybeRequestReview();

    expect(InAppReview.RequestInAppReview).toHaveBeenCalledTimes(1);
  });

  it('never requests again once it has already asked', async () => {
    await maybeRequestReview();
    await maybeRequestReview();
    await maybeRequestReview();
    await maybeRequestReview();
    await maybeRequestReview();

    expect(InAppReview.RequestInAppReview).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the review API is unavailable on the device', async () => {
    (InAppReview.isAvailable as jest.Mock).mockReturnValue(false);

    await maybeRequestReview();
    await maybeRequestReview();
    await maybeRequestReview();

    expect(InAppReview.RequestInAppReview).not.toHaveBeenCalled();
  });

  it('swallows errors and reports them instead of throwing', async () => {
    (InAppReview.RequestInAppReview as jest.Mock).mockRejectedValue(new Error('native failure'));

    await maybeRequestReview();
    await maybeRequestReview();
    await expect(maybeRequestReview()).resolves.toBeUndefined();

    expect(recordError).toHaveBeenCalledWith(expect.any(Error), 'storeReview.maybeRequestReview');
  });
});
