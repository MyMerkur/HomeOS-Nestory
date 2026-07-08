import { z } from 'zod';
import type { TFunction } from 'i18next';

export function makeRegisterSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(2, t('validation.nameMin2')).max(80),
    email: z.string().trim().toLowerCase().email(t('validation.emailInvalid')),
    password: z.string().min(8, t('validation.passwordMin8')),
  });
}

export function makeLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().trim().toLowerCase().email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });
}

export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>;
export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>;
