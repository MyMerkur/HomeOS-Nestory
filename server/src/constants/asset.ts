export const ASSET_CATEGORIES = ['Electronics', 'Appliance', 'Furniture', 'Other'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_STATUSES = ['active', 'archived'] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];
