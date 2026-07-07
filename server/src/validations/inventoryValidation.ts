import { z } from 'zod';
import { CATEGORIES, INVENTORY_ITEM_STATUSES, UNITS } from '../constants/inventory';
import { objectId } from './paramsValidation';

export const createItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  locationId: objectId,
  category: z.enum(CATEGORIES),
  quantity: z.number().positive(),
  unit: z.enum(UNITS),
  expiryDate: z.coerce.date().optional(),
  purchaseDate: z.coerce.date().optional(),
  barcode: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().optional(),
  reminderDaysBefore: z.array(z.number().int().min(0)).optional(),
  doseAmount: z.number().positive().optional(),
  doseTimes: z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:mm formatında olmalı')).optional(),
});

// status kasıtlı olarak burada yok — status değişiklikleri yalnızca
// inventoryActionService'teki consume/discard/freeze aksiyonları üzerinden
// yapılabilir, böylece her status değişikliği garantili audit log üretir.
export const updateItemSchema = createItemSchema.partial();

export const listItemsQuerySchema = z.object({
  locationId: objectId.optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(INVENTORY_ITEM_STATUSES).optional(),
  expiryWindow: z
    .string()
    .regex(/^\d+d$/, 'expiryWindow must look like "7d"')
    .optional(),
  search: z.string().trim().min(1).optional(),
  barcode: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .string()
    .regex(/^[a-zA-Z]+:(asc|desc)$/, 'sort must look like "expiryDate:asc"')
    .optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ListItemsQuery = z.infer<typeof listItemsQuerySchema>;
