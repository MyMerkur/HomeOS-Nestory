import { apiClient } from '../../../services/apiClient';

export type Member = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function listMembers(homeId: string): Promise<Member[]> {
  const { data } = await apiClient.get<ApiEnvelope<{ members: Member[] }>>(`/homes/${homeId}/members`);
  return data.data.members;
}

export async function removeMember(homeId: string, userId: string): Promise<void> {
  await apiClient.delete(`/homes/${homeId}/members/${userId}`);
}

export async function leaveHome(homeId: string): Promise<void> {
  await apiClient.post(`/homes/${homeId}/leave`);
}

export async function updateHomeName(homeId: string, name: string): Promise<{ id: string; name: string }> {
  const { data } = await apiClient.patch<ApiEnvelope<{ home: { id: string; name: string } }>>(
    `/homes/${homeId}`,
    { name },
  );
  return data.data.home;
}

export async function regenerateInviteCode(homeId: string): Promise<string> {
  const { data } = await apiClient.post<ApiEnvelope<{ inviteCode: string }>>(
    `/homes/${homeId}/invite-code/regenerate`,
  );
  return data.data.inviteCode;
}
