const HapticFeedbackTypes = {
  selection: 'selection',
  impactLight: 'impactLight',
  impactMedium: 'impactMedium',
  impactHeavy: 'impactHeavy',
  rigid: 'rigid',
  soft: 'soft',
  notificationSuccess: 'notificationSuccess',
  notificationWarning: 'notificationWarning',
  notificationError: 'notificationError',
};

const ReactNativeHapticFeedback = {
  trigger: jest.fn(),
  stop: jest.fn(),
  isSupported: jest.fn(() => true),
  triggerPattern: jest.fn(),
  getSystemHapticStatus: jest.fn(() => Promise.resolve({ vibrationEnabled: true, ringerMode: null })),
  setEnabled: jest.fn(),
  isEnabled: jest.fn(() => true),
  impact: jest.fn(),
  playAHAP: jest.fn(() => Promise.resolve()),
};

module.exports = ReactNativeHapticFeedback;
module.exports.default = ReactNativeHapticFeedback;
module.exports.HapticFeedbackTypes = HapticFeedbackTypes;
