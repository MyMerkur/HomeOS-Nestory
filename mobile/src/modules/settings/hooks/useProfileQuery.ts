import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../services/settingsApi';

export const PROFILE_QUERY_KEY = 'profile' as const;

export function useProfileQuery() {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
  });
}
