import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getSuggestions } from '../services/recipeApi';

export const RECIPE_SUGGESTIONS_QUERY_KEY = 'recipeSuggestions' as const;

export function useRecipeSuggestionsQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [RECIPE_SUGGESTIONS_QUERY_KEY, homeId],
    queryFn: () => getSuggestions(homeId as string),
    enabled: !!homeId,
  });
}
