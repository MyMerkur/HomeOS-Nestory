import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listMembers } from '../services/familyApi';

export const MEMBERS_QUERY_KEY = 'members' as const;

export function useMembersQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: [MEMBERS_QUERY_KEY, homeId],
    queryFn: () => listMembers(homeId as string),
    enabled: !!homeId,
  });
}
