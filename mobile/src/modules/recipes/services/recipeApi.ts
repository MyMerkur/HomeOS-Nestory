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

export type RecipeLang = 'tr' | 'en';

// Recipe content only exists in Turkish and English; other supported UI
// languages fall back to English rather than showing untranslated Turkish.
export function resolveRecipeLang(language: string): RecipeLang {
  return language.startsWith('tr') ? 'tr' : 'en';
}

export async function getAllRecipes(homeId: string, lang: RecipeLang = 'tr'): Promise<RecipeSuggestion[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ recipes: RecipeSuggestion[] }>>(
    `/homes/${homeId}/recipes`,
    { params: { lang } },
  );
  return data.data.recipes;
}

export async function getSavedRecipes(homeId: string, lang: RecipeLang = 'tr'): Promise<RecipeSuggestion[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ recipes: RecipeSuggestion[] }>>(
    `/homes/${homeId}/recipes/saved`,
    { params: { lang } },
  );
  return data.data.recipes;
}

export async function saveRecipe(homeId: string, recipeId: string): Promise<void> {
  await apiClient.post(`/homes/${homeId}/recipes/${recipeId}/save`);
}

export async function unsaveRecipe(homeId: string, recipeId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/recipes/${recipeId}/save`);
}
