import { z } from 'zod';
import { CATEGORIES, UNITS } from '../constants';

export const itemFormSchema = z.object({
  name: z.string().trim().min(1, 'Ürün adı gerekli').max(120),
  locationId: z.string().min(1, 'Lokasyon seç'),
  category: z.enum(CATEGORIES, { message: 'Kategori seç' }),
  quantity: z.number().positive('Miktar 0’dan büyük olmalı'),
  unit: z.enum(UNITS, { message: 'Birim seç' }),
  expiryDate: z.date().optional(),
  barcode: z.string().trim().optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
