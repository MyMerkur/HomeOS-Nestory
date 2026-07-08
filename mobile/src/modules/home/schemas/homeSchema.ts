import { z } from 'zod';
import type { TFunction } from 'i18next';

export function makeCreateHomeSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.homeNameRequired')).max(80),
  });
}

export function makeJoinHomeSchema(t: TFunction) {
  return z.object({
    inviteCode: z.string().trim().min(1, t('validation.inviteCodeRequired')),
  });
}

export type CreateHomeFormValues = z.infer<ReturnType<typeof makeCreateHomeSchema>>;
export type JoinHomeFormValues = z.infer<ReturnType<typeof makeJoinHomeSchema>>;
