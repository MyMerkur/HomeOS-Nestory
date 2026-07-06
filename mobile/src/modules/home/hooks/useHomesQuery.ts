import { useQuery } from '@tanstack/react-query';
import { listHomesRequest } from '../services/homeApi';

export const HOMES_QUERY_KEY = ['homes'] as const;

export function useHomesQuery() {
  return useQuery({
    queryKey: HOMES_QUERY_KEY,
    queryFn: listHomesRequest,
  });
}
