import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PushToken } from '../models/PushToken';

const send = jest.fn();

jest.mock('firebase-admin/app', () => ({
  cert: jest.fn(),
  getApps: jest.fn().mockReturnValue([]),
  initializeApp: jest.fn(),
}));
jest.mock('firebase-admin/messaging', () => ({
  getMessaging: jest.fn().mockReturnValue({ send }),
}));

import { registerPushToken, removePushToken, sendToUser } from './pushService';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

describe('pushService — token registration', () => {
  it('registers a new push token for a user', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    await registerPushToken(userId, 'token-abc', 'ios');

    const stored = await PushToken.findOne({ userId, token: 'token-abc' });
    expect(stored?.platform).toBe('ios');
  });

  it('upserts without creating a duplicate for the same user+token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();

    await registerPushToken(userId, 'token-abc', 'android');
    await registerPushToken(userId, 'token-abc', 'android');

    const count = await PushToken.countDocuments({ userId, token: 'token-abc' });
    expect(count).toBe(1);
  });

  it('removes a push token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    await registerPushToken(userId, 'token-xyz', 'ios');

    await removePushToken(userId, 'token-xyz');

    expect(await PushToken.findOne({ userId, token: 'token-xyz' })).toBeNull();
  });
});

describe('pushService — sendToUser', () => {
  const originalEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  afterAll(() => {
    process.env.FIREBASE_SERVICE_ACCOUNT = originalEnv;
  });

  beforeEach(() => {
    send.mockReset();
  });

  it('is a no-op that does not throw when no service account is configured', async () => {
    delete process.env.FIREBASE_SERVICE_ACCOUNT;
    const userId = new mongoose.Types.ObjectId().toString();
    await registerPushToken(userId, 'token-abc', 'ios');

    await expect(sendToUser(userId, { title: 'Hi', body: 'There' })).resolves.toBeUndefined();
    expect(send).not.toHaveBeenCalled();
  });

  describe('with Firebase configured', () => {
    beforeEach(() => {
      process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
        project_id: 'test-project',
        client_email: 'test@example.com',
        private_key: 'fake-key',
      });
    });

    it('sends a notification to every registered token for the user', async () => {
      send.mockResolvedValue('message-id');
      const userId = new mongoose.Types.ObjectId().toString();
      await registerPushToken(userId, 'token-1', 'ios');
      await registerPushToken(userId, 'token-2', 'android');

      await sendToUser(userId, { title: 'Expiring soon', body: 'Check your pantry' });

      expect(send).toHaveBeenCalledTimes(2);
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'token-1',
          notification: { title: 'Expiring soon', body: 'Check your pantry' },
        }),
      );
    });

    it('removes tokens that Firebase reports as no longer registered', async () => {
      send.mockImplementation(({ token }: { token: string }) => {
        if (token === 'stale-token') {
          return Promise.reject({ code: 'messaging/registration-token-not-registered' });
        }
        return Promise.resolve('message-id');
      });
      const userId = new mongoose.Types.ObjectId().toString();
      await registerPushToken(userId, 'stale-token', 'ios');
      await registerPushToken(userId, 'valid-token', 'ios');

      await sendToUser(userId, { title: 'Hi', body: 'There' });

      expect(await PushToken.findOne({ userId, token: 'stale-token' })).toBeNull();
      expect(await PushToken.findOne({ userId, token: 'valid-token' })).not.toBeNull();
    });

    it('does not call Firebase when the user has no registered tokens', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      await sendToUser(userId, { title: 'Hi', body: 'There' });

      expect(send).not.toHaveBeenCalled();
    });
  });
});
