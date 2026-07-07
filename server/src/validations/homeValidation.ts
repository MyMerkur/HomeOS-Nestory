import { z } from 'zod';

export const createHomeSchema = z.object({
  name: z.string().trim().min(1).max(80),
  timezone: z.string().trim().min(1).optional(),
  defaultCurrency: z.string().trim().length(3).optional(),
});

export const joinHomeSchema = z.object({
  inviteCode: z.string().trim().min(1),
});

export const updateHomeSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export type CreateHomeInput = z.infer<typeof createHomeSchema>;
export type JoinHomeInput = z.infer<typeof joinHomeSchema>;
export type UpdateHomeInput = z.infer<typeof updateHomeSchema>;
