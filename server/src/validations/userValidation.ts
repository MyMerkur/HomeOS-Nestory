import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  avatarUrl: z.string().trim().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const updateUserSettingsSchema = z.object({
  language: z.string().trim().min(2).max(10).optional(),
  theme: z.literal('light').optional(),
  notificationPreferences: z
    .object({
      expiryReminders: z.boolean().optional(),
      shoppingUpdates: z.boolean().optional(),
      weeklySummary: z.boolean().optional(),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;
