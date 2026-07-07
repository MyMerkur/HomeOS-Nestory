import { apiClient } from '../../../services/apiClient';

export type RecipeIngredient = {
  name: string;
  optional: boolean;
};

export type RecipeSuggestion = {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  coveragePercent: number;
  missingIngredients: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  isSaved: boolean;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function getSuggestions(homeId: string): Promise<RecipeSuggestion[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ recipes: RecipeSuggestion[] }>>(
    `/homes/${homeId}/recipes/suggestions`,
  );
  return data.data.recipes;
}

export async function getSavedRecipes(homeId: string): Promise<RecipeSuggestion[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ recipes: RecipeSuggestion[] }>>(
    `/homes/${homeId}/recipes/saved`,
  );
  return data.data.recipes;
}

export async function saveRecipe(homeId: string, recipeId: string): Promise<void> {
  await apiClient.post(`/homes/${homeId}/recipes/${recipeId}/save`);
}

export async function unsaveRecipe(homeId: string, recipeId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/recipes/${recipeId}/save`);
}
