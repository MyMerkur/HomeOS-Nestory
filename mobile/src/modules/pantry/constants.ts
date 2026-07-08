// server/src/constants/inventory.ts ile birebir aynı değerler (API sözleşmesi).
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

export const UNITS = ['piece', 'gram', 'kg', 'ml', 'liter', 'pack', 'bottle', 'box'] as const;
export type Unit = (typeof UNITS)[number];

// Display labels moved to i18n: t(`pantry.categories.${category}`) / t(`pantry.units.${unit}`).
