import { z } from 'zod';

export const createHomeSchema = z.object({
  name: z.string().trim().min(1, 'Ev adı gerekli').max(80),
});

export const joinHomeSchema = z.object({
  inviteCode: z.string().trim().min(1, 'Davet kodu gerekli'),
});

export type CreateHomeFormValues = z.infer<typeof createHomeSchema>;
export type JoinHomeFormValues = z.infer<typeof joinHomeSchema>;
