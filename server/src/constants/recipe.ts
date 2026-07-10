export const RECIPE_CATEGORIES = [
  'Main',
  'Soup',
  'Breakfast',
  'Salad',
  'Appetizer',
  'Drink',
  'Dessert',
  'Baking',
] as const;

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];
