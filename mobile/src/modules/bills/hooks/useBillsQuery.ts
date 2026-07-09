import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listBills, type ListBillsParams } from '../services/billApi';

export const BILLS_QUERY_KEY = 'bills' as const;

export function useBillsQuery(params: ListBillsParams) {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [BILLS_QUERY_KEY, homeId, params],
    queryFn: () => listBills(homeId as string, params),
    enabled: !!homeId,
  });
}
