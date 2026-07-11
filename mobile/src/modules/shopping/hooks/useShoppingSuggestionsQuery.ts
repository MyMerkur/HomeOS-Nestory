import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getShoppingSuggestions } from '../services/shoppingApi';

export const SHOPPING_SUGGESTIONS_QUERY_KEY = 'shoppingSuggestions' as const;

export function useShoppingSuggestionsQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [SHOPPING_SUGGESTIONS_QUERY_KEY, homeId],
    queryFn: () => getShoppingSuggestions(homeId as string),
    enabled: !!homeId,
  });
}
