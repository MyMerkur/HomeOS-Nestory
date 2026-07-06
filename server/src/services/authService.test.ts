import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import { RefreshToken } from '../models/RefreshToken';
import { AppError } from '../middlewares/errorHandler';

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

const credentials = { name: 'Dogukan', email: 'dogukan@example.com', password: 'Min8Chars!' };

describe('authService', () => {
  it('registers a new user and issues a session', async () => {
    const result = await authService.register(credentials);

    expect(result.user.email).toBe(credentials.email);
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('rejects duplicate email registration', async () => {
    await authService.register(credentials);

    await expect(authService.register(credentials)).rejects.toMatchObject({
      code: 'EMAIL_IN_USE',
    } satisfies Partial<AppError>);
  });

  it('logs in with correct credentials', async () => {
    await authService.register(credentials);

    const result = await authService.login({
      email: credentials.email,
      password: credentials.password,
    });

    expect(result.user.email).toBe(credentials.email);
  });

  it('rejects login with wrong password', async () => {
    await authService.register(credentials);

    await expect(
      authService.login({ email: credentials.email, password: 'wrong-password' }),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' } satisfies Partial<AppError>);
  });

  it('rotates refresh tokens and invalidates the old one', async () => {
    const { refreshToken } = await authService.register(credentials);

    const rotated = await authService.refresh(refreshToken);
    expect(rotated.refreshToken).not.toBe(refreshToken);

    await expect(authService.refresh(refreshToken)).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
    } satisfies Partial<AppError>);
  });

  it('revokes refresh token on logout', async () => {
    const { refreshToken } = await authService.register(credentials);

    await authService.logout(refreshToken);

    const stored = await RefreshToken.findOne({});
    expect(stored?.revokedAt).toBeTruthy();

    await expect(authService.refresh(refreshToken)).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
    });
  });
});
