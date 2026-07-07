import { InventoryItem } from '../models/InventoryItem';
import { Recipe, type RecipeDocument } from '../models/Recipe';
import { SavedRecipe } from '../models/SavedRecipe';
import { AppError } from '../middlewares/errorHandler';

type RecipeSuggestion = {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  coveragePercent: number;
  missingIngredients: string[];
  ingredients: { name: string; optional: boolean }[];
  instructions: string[];
  isSaved: boolean;
};

const SUGGESTIONS_LIMIT = 10;

function toSuggestion(
  recipe: RecipeDocument & { _id: unknown },
  inventoryNames: Set<string>,
  savedRecipeIds: Set<string>,
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

  const id = (recipe._id as { toString(): string }).toString();

  return {
    id,
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
    isSaved: savedRecipeIds.has(id),
  };
}

async function getInventoryNames(homeId: string): Promise<Set<string>> {
  const activeItems = await InventoryItem.find({ homeId, status: 'active' }).select(
    'normalizedName',
  );
  return new Set(activeItems.map((item) => item.normalizedName));
}

async function getSavedRecipeIds(homeId: string): Promise<string[]> {
  const savedRecipes = await SavedRecipe.find({ homeId }).select('recipeId');
  return savedRecipes.map((saved) => saved.recipeId.toString());
}

export async function getSuggestions(homeId: string): Promise<RecipeSuggestion[]> {
  const [inventoryNames, savedRecipeIds] = await Promise.all([
    getInventoryNames(homeId),
    getSavedRecipeIds(homeId),
  ]);
  const savedRecipeIdSet = new Set(savedRecipeIds);

  const recipes = await Recipe.find();

  return recipes
    .map((recipe) => toSuggestion(recipe, inventoryNames, savedRecipeIdSet))
    .filter((suggestion) => suggestion.coveragePercent > 0)
    .sort((a, b) => b.coveragePercent - a.coveragePercent || a.name.localeCompare(b.name))
    .slice(0, SUGGESTIONS_LIMIT);
}

export async function getSavedRecipes(homeId: string): Promise<RecipeSuggestion[]> {
  const [inventoryNames, savedRecipeIds] = await Promise.all([
    getInventoryNames(homeId),
    getSavedRecipeIds(homeId),
  ]);
  if (savedRecipeIds.length === 0) return [];
  const savedRecipeIdSet = new Set(savedRecipeIds);

  const recipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

  return recipes
    .map((recipe) => toSuggestion(recipe, inventoryNames, savedRecipeIdSet))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveRecipe(homeId: string, recipeId: string, userId: string): Promise<void> {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new AppError('Recipe not found', 404, 'RECIPE_NOT_FOUND');
  }

  await SavedRecipe.updateOne(
    { homeId, recipeId },
    { $setOnInsert: { homeId, recipeId, createdBy: userId } },
    { upsert: true },
  );
}

export async function unsaveRecipe(homeId: string, recipeId: string): Promise<void> {
  await SavedRecipe.deleteOne({ homeId, recipeId });
}
