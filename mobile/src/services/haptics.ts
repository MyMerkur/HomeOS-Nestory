import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';

export type HapticType = keyof typeof HapticFeedbackTypes;

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Triggers device haptic feedback for a small, deliberately limited set of
 * moments: primary success actions and destructive-action confirmations.
 * Not intended for tab navigation or general button presses.
 */
export function triggerHaptic(type: HapticType = 'impactLight'): void {
  ReactNativeHapticFeedback.trigger(type, options);
}
