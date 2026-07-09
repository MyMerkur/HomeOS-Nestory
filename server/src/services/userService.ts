import bcrypt from 'bcryptjs';
import type { HydratedDocument } from 'mongoose';
import { User, type UserDocument } from '../models/User';
import { Home } from '../models/Home';
import { Membership } from '../models/Membership';
import { InventoryItem } from '../models/InventoryItem';
import { PantryLocation } from '../models/PantryLocation';
import { ShoppingList } from '../models/ShoppingList';
import { ShoppingItem } from '../models/ShoppingItem';
import { Asset } from '../models/Asset';
import { SavedRecipe } from '../models/SavedRecipe';
import { RefreshToken } from '../models/RefreshToken';
import { PushToken } from '../models/PushToken';
import { AppError } from '../middlewares/errorHandler';
import type {
  ChangePasswordInput,
  UpdateProfileInput,
  UpdateUserSettingsInput,
} from '../validations/userValidation';

const SALT_ROUNDS = 10;

type ProfileResult = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  settings: {
    language: string;
    theme: string;
    notificationPreferences: {
      expiryReminders: boolean;
      shoppingUpdates: boolean;
      weeklySummary: boolean;
      reminderDaysBefore: number[];
      dailyReminderEnabled: boolean;
      dailyReminderHour: number;
    };
  };
};

function toProfileResult(user: HydratedDocument<UserDocument>): ProfileResult {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? null,
    settings: {
      language: user.settings?.language ?? 'tr',
      theme: user.settings?.theme ?? 'system',
      notificationPreferences: {
        expiryReminders: user.settings?.notificationPreferences?.expiryReminders ?? true,
        shoppingUpdates: user.settings?.notificationPreferences?.shoppingUpdates ?? true,
        weeklySummary: user.settings?.notificationPreferences?.weeklySummary ?? true,
        reminderDaysBefore: user.settings?.notificationPreferences?.reminderDaysBefore ?? [7, 3, 1, 0],
        dailyReminderEnabled: user.settings?.notificationPreferences?.dailyReminderEnabled ?? false,
        dailyReminderHour: user.settings?.notificationPreferences?.dailyReminderHour ?? 9,
      },
    },
  };
}

async function findUserOrThrow(userId: string): Promise<HydratedDocument<UserDocument>> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
}

export async function getProfile(userId: string): Promise<ProfileResult> {
  const user = await findUserOrThrow(userId);
  return toProfileResult(user);
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileResult> {
  const user = await findUserOrThrow(userId);

  if (input.name !== undefined) {
    user.name = input.name;
  }
  if (input.avatarUrl !== undefined) {
    user.avatarUrl = input.avatarUrl;
  }

  await user.save();
  return toProfileResult(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const user = await findUserOrThrow(userId);

  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_CURRENT_PASSWORD');
  }

  user.passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
  await user.save();
}

async function deleteHomeData(homeId: string): Promise<void> {
  await Promise.all([
    InventoryItem.deleteMany({ homeId }),
    PantryLocation.deleteMany({ homeId }),
    ShoppingItem.deleteMany({ homeId }),
    ShoppingList.deleteMany({ homeId }),
    Asset.deleteMany({ homeId }),
    SavedRecipe.deleteMany({ homeId }),
    Membership.deleteMany({ homeId }),
  ]);
  await Home.deleteOne({ _id: homeId });
}

/**
 * Deleting an account is destructive and irreversible, so it requires the
 * current password (same confirmation bar as changePassword). A sole home
 * owner with other active members must transfer ownership or remove those
 * members first — same safety rule membershipService.leaveHome already
 * enforces — otherwise their home and shared data would vanish out from
 * under the rest of the household.
 */
export async function deleteAccount(userId: string, password: string): Promise<void> {
  const user = await findUserOrThrow(userId);

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_CURRENT_PASSWORD');
  }

  const memberships = await Membership.find({ userId, status: 'active' }).populate<{
    homeId: { _id: string; name: string };
  }>('homeId', 'name');

  for (const membership of memberships) {
    if (membership.role !== 'owner') continue;

    const otherActiveMembers = await Membership.countDocuments({
      homeId: membership.homeId._id,
      status: 'active',
      userId: { $ne: userId },
    });

    if (otherActiveMembers > 0) {
      throw new AppError(
        `Transfer ownership or remove other members of "${membership.homeId.name}" before deleting your account`,
        400,
        'HOME_OWNERSHIP_BLOCKS_DELETION',
      );
    }
  }

  for (const membership of memberships) {
    if (membership.role === 'owner') {
      await deleteHomeData(membership.homeId._id.toString());
    }
  }

  await Promise.all([
    Membership.deleteMany({ userId }),
    RefreshToken.deleteMany({ userId }),
    PushToken.deleteMany({ userId }),
  ]);
  await User.deleteOne({ _id: userId });
}

export async function updateSettings(
  userId: string,
  input: UpdateUserSettingsInput,
): Promise<ProfileResult> {
  const user = await findUserOrThrow(userId);

  user.settings = {
    language: input.language ?? user.settings?.language ?? 'tr',
    theme: input.theme ?? user.settings?.theme ?? 'system',
    notificationPreferences: {
      expiryReminders:
        input.notificationPreferences?.expiryReminders ??
        user.settings?.notificationPreferences?.expiryReminders ??
        true,
      shoppingUpdates:
        input.notificationPreferences?.shoppingUpdates ??
        user.settings?.notificationPreferences?.shoppingUpdates ??
        true,
      weeklySummary:
        input.notificationPreferences?.weeklySummary ??
        user.settings?.notificationPreferences?.weeklySummary ??
        true,
      reminderDaysBefore:
        input.notificationPreferences?.reminderDaysBefore ??
        user.settings?.notificationPreferences?.reminderDaysBefore ??
        [7, 3, 1, 0],
      dailyReminderEnabled:
        input.notificationPreferences?.dailyReminderEnabled ??
        user.settings?.notificationPreferences?.dailyReminderEnabled ??
        false,
      dailyReminderHour:
        input.notificationPreferences?.dailyReminderHour ??
        user.settings?.notificationPreferences?.dailyReminderHour ??
        9,
    },
  };

  await user.save();
  return toProfileResult(user);
}
