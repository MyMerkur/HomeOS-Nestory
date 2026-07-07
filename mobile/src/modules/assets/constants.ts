export const ASSET_CATEGORIES = ['Electronics', 'Appliance', 'Furniture', 'Other'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  Electronics: 'Elektronik',
  Appliance: 'Beyaz Eşya',
  Furniture: 'Mobilya',
  Other: 'Diğer',
};
