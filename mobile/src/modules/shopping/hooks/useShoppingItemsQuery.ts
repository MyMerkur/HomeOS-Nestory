import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listShoppingItems } from '../services/shoppingApi';

export const SHOPPING_ITEMS_QUERY_KEY = 'shoppingItems' as const;

export function useShoppingItemsQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [SHOPPING_ITEMS_QUERY_KEY, homeId],
    queryFn: () => listShoppingItems(homeId as string),
    enabled: !!homeId,
  });
}
