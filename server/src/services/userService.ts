import bcrypt from 'bcryptjs';
import type { HydratedDocument } from 'mongoose';
import { User, type UserDocument } from '../models/User';
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
    },
  };

  await user.save();
  return toProfileResult(user);
}
