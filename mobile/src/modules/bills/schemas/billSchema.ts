import { z } from 'zod';
import type { TFunction } from 'i18next';
import { BILL_CATEGORIES } from '../constants';

export function makeBillFormSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(1, t('validation.billNameRequired')).max(120),
    category: z.enum(BILL_CATEGORIES, { message: t('validation.categoryRequired') }),
    amount: z.number().min(0, t('validation.amountRequired')),
    dueDate: z.date({ message: t('validation.dueDateRequired') }),
    isRecurring: z.boolean().optional(),
    notes: z.string().trim().max(500).optional(),
  });
}

export type BillFormValues = z.infer<ReturnType<typeof makeBillFormSchema>>;
