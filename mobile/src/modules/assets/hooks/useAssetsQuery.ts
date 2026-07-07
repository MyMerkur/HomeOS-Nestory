import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listAssets, type ListAssetsParams } from '../services/assetApi';

export const ASSETS_QUERY_KEY = 'assets' as const;

export function useAssetsQuery(params: ListAssetsParams) {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [ASSETS_QUERY_KEY, homeId, params],
    queryFn: () => listAssets(homeId as string, params),
    enabled: !!homeId,
  });
}
