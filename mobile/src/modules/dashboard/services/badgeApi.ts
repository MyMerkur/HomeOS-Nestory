import { apiClient } from '../../../services/apiClient';

export type Badge = {
  id: string;
  name: string;
  description: string;
  target: number;
  progress: number;
  earned: boolean;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function getBadges(homeId: string): Promise<Badge[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ badges: Badge[] }>>(`/homes/${homeId}/badges`);
  return data.data.badges;
}
