const notifee = {
  createChannel: jest.fn(() => Promise.resolve('expiry-reminders')),
  requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
  getTriggerNotificationIds: jest.fn(() => Promise.resolve([])),
  cancelTriggerNotification: jest.fn(() => Promise.resolve()),
  createTriggerNotification: jest.fn(() => Promise.resolve('notification-id')),
  displayNotification: jest.fn(() => Promise.resolve('notification-id')),
};

module.exports = notifee;
module.exports.default = notifee;
module.exports.TriggerType = { TIMESTAMP: 0, INTERVAL: 1 };
module.exports.RepeatFrequency = { NONE: -1, HOURLY: 0, DAILY: 1, WEEKLY: 2 };
