export const BILL_CATEGORIES = [
  'Electricity',
  'Water',
  'Gas',
  'Internet',
  'Rent',
  'Subscription',
  'Other',
] as const;
export type BillCategory = (typeof BILL_CATEGORIES)[number];

export const BILL_STATUSES = ['unpaid', 'paid'] as const;
export type BillStatus = (typeof BILL_STATUSES)[number];
