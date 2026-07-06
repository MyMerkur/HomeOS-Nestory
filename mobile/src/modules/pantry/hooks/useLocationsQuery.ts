import { useQuery } from '@tanstack/react-query';
import { useHomeStore } from '../../../store/useHomeStore';
import { listLocations } from '../services/pantryApi';

export function useLocationsQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);

  return useQuery({
    queryKey: ['locations', homeId],
    queryFn: () => listLocations(homeId as string),
    enabled: !!homeId,
  });
}
