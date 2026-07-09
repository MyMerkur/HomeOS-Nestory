// server/src/constants/bill.ts ile birebir aynı değerler (API sözleşmesi).
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

// Display labels moved to i18n: t(`bills.categories.${category}`).
