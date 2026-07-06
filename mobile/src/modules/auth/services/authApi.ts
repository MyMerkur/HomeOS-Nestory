import { apiClient } from '../../../services/apiClient';
import type { LoginFormValues, RegisterFormValues } from '../schemas/authSchema';

export type AuthUser = { id: string; name: string; email: string };

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type ApiEnvelope<T> = { success: boolean; data: T; message: string };

export async function registerRequest(input: RegisterFormValues): Promise<AuthSession> {
  const { data } = await apiClient.post<ApiEnvelope<AuthSession>>('/auth/register', input);
  return data.data;
}

export async function loginRequest(input: LoginFormValues): Promise<AuthSession> {
  const { data } = await apiClient.post<ApiEnvelope<AuthSession>>('/auth/login', input);
  return data.data;
}

export async function refreshRequest(refreshToken: string): Promise<AuthSession> {
  const { data } = await apiClient.post<ApiEnvelope<AuthSession>>('/auth/refresh', {
    refreshToken,
  });
  return data.data;
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}
