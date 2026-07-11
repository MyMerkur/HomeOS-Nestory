import { z } from 'zod';
import type { TFunction } from 'i18next';
import { CATEGORIES, UNITS } from '../constants';

export function makeItemFormSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.itemNameRequired')).max(120),
    locationId: z.string().min(1, t('validation.locationRequired')),
    category: z.enum(CATEGORIES, { message: t('validation.categoryRequired') }),
    quantity: z.number().positive(t('validation.quantityPositive')),
    unit: z.enum(UNITS, { message: t('validation.unitRequired') }),
    expiryDate: z.date().optional(),
    barcode: z.string().trim().optional(),
    price: z.number().nonnegative().optional(),
    doseAmount: z.number().positive().optional(),
    doseTimes: z.array(z.string()).optional(),
  });
}

export type ItemFormValues = z.infer<ReturnType<typeof makeItemFormSchema>>;
