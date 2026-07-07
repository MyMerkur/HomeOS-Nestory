import { z } from 'zod';
import { ASSET_CATEGORIES } from '../constants';

export const assetFormSchema = z.object({
  name: z.string().trim().min(1, 'Eşya adı gerekli').max(120),
  category: z.enum(ASSET_CATEGORIES, { message: 'Kategori seç' }),
  room: z.string().trim().optional(),
  brand: z.string().trim().optional(),
  serialNumber: z.string().trim().optional(),
  purchaseDate: z.date().optional(),
  price: z.number().positive().optional(),
  warrantyEndDate: z.date().optional(),
  notes: z.string().trim().max(500).optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
