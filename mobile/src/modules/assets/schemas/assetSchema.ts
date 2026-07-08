import { z } from 'zod';
import type { TFunction } from 'i18next';
import { ASSET_CATEGORIES } from '../constants';

export function makeAssetFormSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.assetNameRequired')).max(120),
    category: z.enum(ASSET_CATEGORIES, { message: t('validation.categoryRequired') }),
    room: z.string().trim().optional(),
    brand: z.string().trim().optional(),
    serialNumber: z.string().trim().optional(),
    purchaseDate: z.date().optional(),
    price: z.number().positive().optional(),
    warrantyEndDate: z.date().optional(),
    notes: z.string().trim().max(500).optional(),
  });
}

export type AssetFormValues = z.infer<ReturnType<typeof makeAssetFormSchema>>;
