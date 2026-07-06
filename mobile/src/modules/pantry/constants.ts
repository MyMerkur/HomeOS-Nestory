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

export const CATEGORY_LABELS: Record<Category, string> = {
  Dairy: 'Süt Ürünleri',
  Meat: 'Et',
  Vegetable: 'Sebze',
  Fruit: 'Meyve',
  Bakery: 'Fırın',
  Drink: 'İçecek',
  Frozen: 'Dondurulmuş',
  Cleaning: 'Temizlik',
  Medicine: 'İlaç',
  Other: 'Diğer',
};

export const UNITS = ['piece', 'gram', 'kg', 'ml', 'liter', 'pack', 'bottle', 'box'] as const;
export type Unit = (typeof UNITS)[number];

export const UNIT_LABELS: Record<Unit, string> = {
  piece: 'Adet',
  gram: 'Gram',
  kg: 'Kilogram',
  ml: 'Mililitre',
  liter: 'Litre',
  pack: 'Paket',
  bottle: 'Şişe',
  box: 'Kutu',
};
