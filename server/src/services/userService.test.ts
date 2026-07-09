import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as authService from './authService';
import * as userService from './userService';
import * as homeService from './homeService';
import * as locationService from './locationService';
import * as inventoryService from './inventoryService';
import { Home } from '../models/Home';
import { Membership } from '../models/Membership';
import { InventoryItem } from '../models/InventoryItem';
import { RefreshToken } from '../models/RefreshToken';

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
      reminderDaysBefore: [7, 3, 1, 0],
      dailyReminderEnabled: false,
      dailyReminderHour: 9,
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
      reminderDaysBefore: [7, 3, 1, 0],
      dailyReminderEnabled: false,
      dailyReminderHour: 9,
    });
  });

  it('updates the language preference without resetting untouched fields', async () => {
    const user = await registerUser();

    const updated = await userService.updateSettings(user.id, { language: 'de' });

    expect(updated.settings.language).toBe('de');
    expect(updated.settings.theme).toBe('system');
  });

  describe('deleteAccount', () => {
    it('rejects deletion with the wrong password', async () => {
      const user = await registerUser();

      await expect(
        userService.deleteAccount(user.id, 'WrongPassword!'),
      ).rejects.toMatchObject({ code: 'INVALID_CURRENT_PASSWORD' });
    });

    it('deletes the user and their refresh tokens', async () => {
      const user = await registerUser();
      const session = await authService.login({ email: user.email, password: 'Min8Chars!' });

      await userService.deleteAccount(user.id, 'Min8Chars!');

      await expect(userService.getProfile(user.id)).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });
      expect(await RefreshToken.countDocuments({ userId: user.id })).toBe(0);
      expect(session.refreshToken).toBeDefined();
    });

    it('cascades and deletes a home the user solely owns', async () => {
      const user = await registerUser();
      const { home } = await homeService.createHome(user.id, { name: 'Solo Home' });
      const locations = await locationService.listLocations(home.id);
      await inventoryService.createItem(home.id, user.id, {
        name: 'Milk',
        locationId: locations[0].id,
        category: 'Dairy',
        quantity: 1,
        unit: 'piece',
      });

      await userService.deleteAccount(user.id, 'Min8Chars!');

      expect(await Home.findById(home.id)).toBeNull();
      expect(await InventoryItem.countDocuments({ homeId: home.id })).toBe(0);
      expect(await Membership.countDocuments({ homeId: home.id })).toBe(0);
    });

    it('blocks deletion when the user solely owns a home with other active members', async () => {
      const owner = await registerUser();
      const { home, inviteCode } = await homeService.createHome(owner.id, { name: 'Shared Home' });
      const member = await registerUser();
      await homeService.joinHome(member.id, inviteCode);

      await expect(userService.deleteAccount(owner.id, 'Min8Chars!')).rejects.toMatchObject({
        code: 'HOME_OWNERSHIP_BLOCKS_DELETION',
      });
      expect(await Home.findById(home.id)).not.toBeNull();
    });

    it('lets a non-owner member delete their account without touching the shared home', async () => {
      const owner = await registerUser();
      const { home, inviteCode } = await homeService.createHome(owner.id, { name: 'Shared Home' });
      const member = await registerUser();
      await homeService.joinHome(member.id, inviteCode);

      await userService.deleteAccount(member.id, 'Min8Chars!');

      expect(await Home.findById(home.id)).not.toBeNull();
      expect(
        await Membership.countDocuments({ homeId: home.id, userId: member.id, status: 'active' }),
      ).toBe(0);
    });
  });
});
