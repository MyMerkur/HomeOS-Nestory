export const UNITS = ['piece', 'gram', 'kg', 'ml', 'liter', 'pack', 'bottle', 'box'] as const;
export type Unit = (typeof UNITS)[number];

// Handbook bölüm 20 (Seed Data) seed kategori listesi.
export const CATEGORIES = [
  'Dairy',
  'Meat',
  'Vegetable',
  'Fruit',
  'Bakery',
  'Drink',
  'Frozen',
  'Cleaning',
  'Medicine',
  'Other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INVENTORY_ITEM_STATUSES = [
  'active',
  'consumed',
  'expired',
  'discarded',
  'frozen',
] as const;
export type InventoryItemStatus = (typeof INVENTORY_ITEM_STATUSES)[number];
