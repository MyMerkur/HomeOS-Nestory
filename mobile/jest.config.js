module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  forceExit: true,
  setupFilesAfterEnv: ['<rootDir>/src/i18n/testSetup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@tanstack|react-native-screens|react-native-safe-area-context|@react-native-async-storage)/)',
  ],
};
