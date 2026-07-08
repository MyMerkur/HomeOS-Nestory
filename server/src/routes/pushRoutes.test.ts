import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../app';
import * as authService from '../services/authService';
import { PushToken } from '../models/PushToken';
import { signAccessToken } from '../utils/tokens';

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

async function registerUserWithToken() {
  const { user } = await authService.register({
    name: 'Ada',
    email: `ada-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  return { userId: user.id, accessToken: signAccessToken(user.id) };
}

describe('POST /api/users/me/push-tokens', () => {
  const app = createApp();

  it('registers a push token for the authenticated user', async () => {
    const { userId, accessToken } = await registerUserWithToken();

    const res = await request(app)
      .post('/api/users/me/push-tokens')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ token: 'device-token-1', platform: 'ios' });

    expect(res.status).toBe(201);
    expect(await PushToken.findOne({ userId, token: 'device-token-1' })).not.toBeNull();
  });

  it('rejects an invalid platform', async () => {
    const { accessToken } = await registerUserWithToken();

    const res = await request(app)
      .post('/api/users/me/push-tokens')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ token: 'device-token-1', platform: 'windows' });

    expect(res.status).toBe(422);
  });

  it('requires authentication', async () => {
    const res = await request(app)
      .post('/api/users/me/push-tokens')
      .send({ token: 'device-token-1', platform: 'ios' });

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/users/me/push-tokens/:token', () => {
  const app = createApp();

  it('removes a push token for the authenticated user', async () => {
    const { userId, accessToken } = await registerUserWithToken();
    await PushToken.create({ userId, token: 'device-token-2', platform: 'android' });

    const res = await request(app)
      .delete('/api/users/me/push-tokens/device-token-2')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(await PushToken.findOne({ userId, token: 'device-token-2' })).toBeNull();
  });
});
