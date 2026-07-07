import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z.string().min(8, 'En az 8 karakter'),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const homeNameSchema = z.object({
  name: z.string().trim().min(1, 'Ev adı gerekli').max(80),
});

export type HomeNameFormValues = z.infer<typeof homeNameSchema>;
