import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getDashboard } from '../services/dashboardApi';

export const DASHBOARD_QUERY_KEY = 'dashboard' as const;

export function useDashboardQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, homeId],
    queryFn: () => getDashboard(homeId as string),
    enabled: !!homeId,
  });
}
