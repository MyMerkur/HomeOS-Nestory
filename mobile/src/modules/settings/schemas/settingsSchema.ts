import { z } from 'zod';
import type { TFunction } from 'i18next';

export function makeChangePasswordSchema(t: TFunction) {
  return z.object({
    currentPassword: z.string().min(1, t('validation.currentPasswordRequired')),
    newPassword: z.string().min(8, t('validation.passwordMin8')),
  });
}

export function makeHomeNameSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.homeNameRequired')).max(80),
  });
}

export type ChangePasswordFormValues = z.infer<ReturnType<typeof makeChangePasswordSchema>>;
export type HomeNameFormValues = z.infer<ReturnType<typeof makeHomeNameSchema>>;
