import { z } from 'zod';
import { CATEGORIES, UNITS } from '../constants/inventory';

export const createShoppingItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  quantity: z.number().positive().optional(),
  unit: z.enum(UNITS).optional(),
  category: z.enum(CATEGORIES).optional(),
});

export const updateShoppingItemSchema = createShoppingItemSchema.partial();

export const listShoppingItemsQuerySchema = z.object({
  status: z.enum(['pending', 'checked']).optional(),
});

export type CreateShoppingItemInput = z.infer<typeof createShoppingItemSchema>;
export type UpdateShoppingItemInput = z.infer<typeof updateShoppingItemSchema>;
