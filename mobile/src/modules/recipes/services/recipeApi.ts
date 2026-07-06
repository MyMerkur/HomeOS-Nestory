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
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function getSuggestions(homeId: string): Promise<RecipeSuggestion[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ recipes: RecipeSuggestion[] }>>(
    `/homes/${homeId}/recipes/suggestions`,
  );
  return data.data.recipes;
}
