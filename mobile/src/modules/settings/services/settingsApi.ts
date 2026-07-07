import { apiClient } from '../../../services/apiClient';

export type NotificationPreferences = {
  expiryReminders: boolean;
  shoppingUpdates: boolean;
  weeklySummary: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  settings: {
    language: string;
    theme: string;
    notificationPreferences: NotificationPreferences;
  };
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<ApiEnvelope<{ user: UserProfile }>>('/users/me');
  return data.data.user;
}

export async function updateProfile(input: { name?: string }): Promise<UserProfile> {
  const { data } = await apiClient.patch<ApiEnvelope<{ user: UserProfile }>>('/users/me', input);
  return data.data.user;
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiClient.patch('/users/me/password', input);
}

export async function updateNotificationPreferences(
  notificationPreferences: Partial<NotificationPreferences>,
): Promise<UserProfile> {
  const { data } = await apiClient.patch<ApiEnvelope<{ user: UserProfile }>>('/users/me/settings', {
    notificationPreferences,
  });
  return data.data.user;
}
