import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { triggerHaptic } from './haptics';

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to impactLight when no type is given', () => {
    triggerHaptic();

    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  });

  it('triggers the requested haptic type', () => {
    triggerHaptic('notificationSuccess');

    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  });

  it('triggers a notification warning haptic', () => {
    triggerHaptic('notificationWarning');

    expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationWarning', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  });
});
