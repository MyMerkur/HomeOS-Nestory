import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getAllRecipes } from '../services/recipeApi';

export const ALL_RECIPES_QUERY_KEY = 'allRecipes' as const;

export function useAllRecipesQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [ALL_RECIPES_QUERY_KEY, homeId],
    queryFn: () => getAllRecipes(homeId as string),
    enabled: !!homeId,
  });
}
