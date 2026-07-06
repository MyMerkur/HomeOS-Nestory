import { apiClient } from '../../../services/apiClient';
import type { CreateHomeFormValues, JoinHomeFormValues } from '../schemas/homeSchema';

export type HomeSummary = {
  id: string;
  name: string;
  timezone: string;
  defaultCurrency: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function createHomeRequest(
  input: CreateHomeFormValues,
): Promise<{ home: HomeSummary; inviteCode: string }> {
  const { data } = await apiClient.post<ApiEnvelope<{ home: HomeSummary; inviteCode: string }>>(
    '/homes',
    input,
  );
  return data.data;
}

export async function listHomesRequest(): Promise<HomeSummary[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ homes: HomeSummary[] }>>('/homes');
  return data.data.homes;
}

export async function joinHomeRequest(input: JoinHomeFormValues): Promise<HomeSummary> {
  const { data } = await apiClient.post<ApiEnvelope<{ home: HomeSummary }>>('/homes/join', input);
  return data.data.home;
}
