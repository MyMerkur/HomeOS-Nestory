import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  avatarUrl: z.string().trim().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
});

export const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'es', 'it', 'cs', 'pt'] as const;

export const updateUserSettingsSchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notificationPreferences: z
    .object({
      expiryReminders: z.boolean().optional(),
      shoppingUpdates: z.boolean().optional(),
      weeklySummary: z.boolean().optional(),
      reminderDaysBefore: z.array(z.number().int().min(0)).max(10).optional(),
      dailyReminderEnabled: z.boolean().optional(),
      dailyReminderHour: z.number().int().min(0).max(23).optional(),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
