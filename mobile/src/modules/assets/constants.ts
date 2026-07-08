export const ASSET_CATEGORIES = ['Electronics', 'Appliance', 'Furniture', 'Other'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

// Display labels moved to i18n: t(`assets.categories.${category}`).
