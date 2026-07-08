import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as userService from './userService';

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

async function registerUser() {
  const { user } = await authService.register({
    name: 'Ada',
    email: `ada-${Date.now()}-${Math.random()}@example.com`,
    password: 'Min8Chars!',
  });
  return user;
}

describe('userService', () => {
  it('fetches the profile with default settings', async () => {
    const user = await registerUser();

    const profile = await userService.getProfile(user.id);

    expect(profile.name).toBe('Ada');
    expect(profile.settings.notificationPreferences).toEqual({
      expiryReminders: true,
      shoppingUpdates: true,
      weeklySummary: true,
    });
  });

  it('updates the profile name', async () => {
    const user = await registerUser();

    const updated = await userService.updateProfile(user.id, { name: 'Ada Lovelace' });

    expect(updated.name).toBe('Ada Lovelace');
  });

  it('changes the password when the current password is correct', async () => {
    const user = await registerUser();

    await userService.changePassword(user.id, {
      currentPassword: 'Min8Chars!',
      newPassword: 'NewPass123!',
    });

    await expect(
      authService.login({ email: user.email, password: 'NewPass123!' }),
    ).resolves.toBeDefined();
  });

  it('rejects a password change with the wrong current password', async () => {
    const user = await registerUser();

    await expect(
      userService.changePassword(user.id, {
        currentPassword: 'WrongPassword!',
        newPassword: 'NewPass123!',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_CURRENT_PASSWORD' });
  });

  it('updates notification preferences without resetting untouched fields', async () => {
    const user = await registerUser();

    const updated = await userService.updateSettings(user.id, {
      notificationPreferences: { expiryReminders: false },
    });

    expect(updated.settings.notificationPreferences).toEqual({
      expiryReminders: false,
      shoppingUpdates: true,
      weeklySummary: true,
    });
  });

  it('updates the language preference without resetting untouched fields', async () => {
    const user = await registerUser();

    const updated = await userService.updateSettings(user.id, { language: 'de' });

    expect(updated.settings.language).toBe('de');
    expect(updated.settings.theme).toBe('system');
  });
});
