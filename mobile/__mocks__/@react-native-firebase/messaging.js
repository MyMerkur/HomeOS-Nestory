const messagingInstance = {
  requestPermission: jest.fn(() => Promise.resolve(1)),
  getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
  setBackgroundMessageHandler: jest.fn(),
  onMessage: jest.fn(() => jest.fn()),
};

const messaging = jest.fn(() => messagingInstance);
messaging.AuthorizationStatus = { NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2 };

module.exports = messaging;
module.exports.default = messaging;
