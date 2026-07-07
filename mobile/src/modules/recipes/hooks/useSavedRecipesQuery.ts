import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getSavedRecipes } from '../services/recipeApi';

export const SAVED_RECIPES_QUERY_KEY = 'savedRecipes' as const;

export function useSavedRecipesQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [SAVED_RECIPES_QUERY_KEY, homeId],
    queryFn: () => getSavedRecipes(homeId as string),
    enabled: !!homeId,
  });
}
