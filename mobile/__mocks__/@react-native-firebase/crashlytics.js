const crashlyticsInstance = {
  setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
  recordError: jest.fn(() => Promise.resolve()),
  log: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve()),
};

const crashlytics = jest.fn(() => crashlyticsInstance);

module.exports = crashlytics;
module.exports.default = crashlytics;
