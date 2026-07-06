import { InventoryItem } from '../models/InventoryItem';
import { Recipe, type RecipeDocument } from '../models/Recipe';

type RecipeSuggestion = {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  coveragePercent: number;
  missingIngredients: string[];
  ingredients: { name: string; optional: boolean }[];
  instructions: string[];
};

const SUGGESTIONS_LIMIT = 10;

function toSuggestion(
  recipe: RecipeDocument & { _id: unknown },
  inventoryNames: Set<string>,
): RecipeSuggestion {
  const requiredIngredients = recipe.ingredients.filter((ingredient) => !ingredient.optional);
  const matchedCount = requiredIngredients.filter((ingredient) =>
    inventoryNames.has(ingredient.normalizedName),
  ).length;
  const missingIngredients = requiredIngredients
    .filter((ingredient) => !inventoryNames.has(ingredient.normalizedName))
    .map((ingredient) => ingredient.name);

  const coveragePercent = requiredIngredients.length
    ? Math.round((matchedCount / requiredIngredients.length) * 100)
    : 0;

  return {
    id: (recipe._id as { toString(): string }).toString(),
    name: recipe.name,
    category: recipe.category ?? null,
    imageUrl: recipe.imageUrl ?? null,
    coveragePercent,
    missingIngredients,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name,
      optional: ingredient.optional,
    })),
    instructions: recipe.instructions,
  };
}

export async function getSuggestions(homeId: string): Promise<RecipeSuggestion[]> {
  const activeItems = await InventoryItem.find({ homeId, status: 'active' }).select(
    'normalizedName',
  );
  const inventoryNames = new Set(activeItems.map((item) => item.normalizedName));

  const recipes = await Recipe.find();

  return recipes
    .map((recipe) => toSuggestion(recipe, inventoryNames))
    .filter((suggestion) => suggestion.coveragePercent > 0)
    .sort((a, b) => b.coveragePercent - a.coveragePercent || a.name.localeCompare(b.name))
    .slice(0, SUGGESTIONS_LIMIT);
}
