import { z } from 'zod';
import { BILL_CATEGORIES, BILL_STATUSES } from '../constants/bill';

export const createBillSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(BILL_CATEGORIES),
  amount: z.number().min(0),
  dueDate: z.coerce.date(),
  isRecurring: z.boolean().optional(),
  reminderDaysBefore: z.array(z.number().int().min(0)).optional(),
  notes: z.string().trim().max(500).optional(),
});

export const updateBillSchema = createBillSchema.partial();

export const listBillsQuerySchema = z.object({
  status: z.enum(BILL_STATUSES).optional(),
  category: z.enum(BILL_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .string()
    .regex(/^[a-zA-Z]+:(asc|desc)$/, 'sort must look like "dueDate:asc"')
    .optional(),
});

export type CreateBillInput = z.infer<typeof createBillSchema>;
export type UpdateBillInput = z.infer<typeof updateBillSchema>;
export type ListBillsQuery = z.infer<typeof listBillsQuerySchema>;
