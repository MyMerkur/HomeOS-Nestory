import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listItems, type ListItemsParams } from '../services/pantryApi';

export const INVENTORY_ITEMS_QUERY_KEY = 'items' as const;

export function useInventoryItemsQuery(params: ListItemsParams) {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [INVENTORY_ITEMS_QUERY_KEY, homeId, params],
    queryFn: () => listItems(homeId as string, params),
    enabled: !!homeId,
  });
}
