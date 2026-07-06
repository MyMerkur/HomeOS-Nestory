import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { getBadges } from '../services/badgeApi';

export const BADGES_QUERY_KEY = 'badges' as const;

export function useBadgesQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [BADGES_QUERY_KEY, homeId],
    queryFn: () => getBadges(homeId as string),
    enabled: !!homeId,
  });
}
