module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@tanstack|react-native-screens|react-native-safe-area-context)/)',
  ],
};
