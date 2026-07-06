import { z } from 'zod';

export const locationTypeEnum = z.enum([
  'fridge',
  'freezer',
  'pantry',
  'cabinet',
  'medicine',
  'other',
]);

export const createLocationSchema = z.object({
  name: z.string().trim().min(1).max(40),
  type: locationTypeEnum,
  order: z.number().int().min(0).optional(),
});

export const updateLocationSchema = createLocationSchema.partial();

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
