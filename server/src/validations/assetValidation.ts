import { z } from 'zod';
import { ASSET_CATEGORIES, ASSET_STATUSES } from '../constants/asset';

export const createAssetSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(ASSET_CATEGORIES),
  room: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  serialNumber: z.string().trim().optional(),
  purchaseDate: z.coerce.date().optional(),
  price: z.number().min(0).optional(),
  warrantyEndDate: z.coerce.date().optional(),
  notes: z.string().trim().max(500).optional(),
  reminderDaysBefore: z.array(z.number().int().min(0)).optional(),
});

// InventoryItem'ın aksine assets için audit log yok, bu yüzden status
// (active/archived) doğrudan genel PATCH üzerinden değiştirilebilir.
export const updateAssetSchema = createAssetSchema.partial().extend({
  status: z.enum(ASSET_STATUSES).optional(),
});

export const listAssetsQuerySchema = z.object({
  status: z.enum(ASSET_STATUSES).optional(),
  category: z.enum(ASSET_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .string()
    .regex(/^[a-zA-Z]+:(asc|desc)$/, 'sort must look like "warrantyEndDate:asc"')
    .optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type ListAssetsQuery = z.infer<typeof listAssetsQuerySchema>;
