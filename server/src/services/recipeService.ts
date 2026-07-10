import { InventoryItem } from '../models/InventoryItem';
import { Recipe, type RecipeDocument } from '../models/Recipe';
import { SavedRecipe } from '../models/SavedRecipe';
import { AppError } from '../middlewares/errorHandler';

export type RecipeLang = 'tr' | 'en';

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

function toSuggestion(
  recipe: RecipeDocument & { _id: unknown },
  inventoryNames: Set<string>,
  savedRecipeIds: Set<string>,
  lang: RecipeLang,
): RecipeSuggestion {
  const requiredIngredients = recipe.ingredients.filter((ingredient) => !ingredient.optional);
  const matchedCount = requiredIngredients.filter((ingredient) =>
    inventoryNames.has(ingredient.normalizedName),
  ).length;
  const ingredientLabel = (ingredient: { name: string; nameEn?: string | null }) =>
    lang === 'en' && ingredient.nameEn ? ingredient.nameEn : ingredient.name;
  const missingIngredients = requiredIngredients
    .filter((ingredient) => !inventoryNames.has(ingredient.normalizedName))
    .map(ingredientLabel);

  const coveragePercent = requiredIngredients.length
    ? Math.round((matchedCount / requiredIngredients.length) * 100)
    : 0;

  const id = (recipe._id as { toString(): string }).toString();

  return {
    id,
    name: lang === 'en' && recipe.nameEn ? recipe.nameEn : recipe.name,
    category: recipe.category ?? null,
    imageUrl: recipe.imageUrl ?? null,
    coveragePercent,
    missingIngredients,
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredientLabel(ingredient),
      optional: ingredient.optional,
    })),
    instructions:
      lang === 'en' && recipe.instructionsEn?.length ? recipe.instructionsEn : recipe.instructions,
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

// Returns every recipe (including 0% coverage), sorted by how ready-to-cook
// it is, so the Recipes screen can list the full catalog.
export async function getAllRecipes(homeId: string, lang: RecipeLang = 'tr'): Promise<RecipeSuggestion[]> {
  const [inventoryNames, savedRecipeIds] = await Promise.all([
    getInventoryNames(homeId),
    getSavedRecipeIds(homeId),
  ]);
  const savedRecipeIdSet = new Set(savedRecipeIds);

  const recipes = await Recipe.find();

  return recipes
    .map((recipe) => toSuggestion(recipe, inventoryNames, savedRecipeIdSet, lang))
    .sort((a, b) => b.coveragePercent - a.coveragePercent || a.name.localeCompare(b.name));
}

export async function getSavedRecipes(homeId: string, lang: RecipeLang = 'tr'): Promise<RecipeSuggestion[]> {
  const [inventoryNames, savedRecipeIds] = await Promise.all([
    getInventoryNames(homeId),
    getSavedRecipeIds(homeId),
  ]);
  if (savedRecipeIds.length === 0) return [];
  const savedRecipeIdSet = new Set(savedRecipeIds);

  const recipes = await Recipe.find({ _id: { $in: savedRecipeIds } });

  return recipes
    .map((recipe) => toSuggestion(recipe, inventoryNames, savedRecipeIdSet, lang))
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
