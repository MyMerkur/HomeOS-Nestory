const notifee = {
  createChannel: jest.fn(() => Promise.resolve('expiry-reminders')),
  requestPermission: jest.fn(() => Promise.resolve({ authorizationStatus: 1 })),
  getTriggerNotificationIds: jest.fn(() => Promise.resolve([])),
  cancelTriggerNotification: jest.fn(() => Promise.resolve()),
  createTriggerNotification: jest.fn(() => Promise.resolve('notification-id')),
};

module.exports = notifee;
module.exports.default = notifee;
module.exports.TriggerType = { TIMESTAMP: 0, INTERVAL: 1 };
