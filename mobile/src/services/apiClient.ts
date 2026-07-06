import axios, { type AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/env';
import { useAuthStore } from '../store/useAuthStore';
import { refreshRequest } from '../modules/auth/services/authApi';
import { clearStoredRefreshToken, getStoredRefreshToken } from './secureStorage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

let pendingRefresh: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const storedRefreshToken = await getStoredRefreshToken();
  if (!storedRefreshToken) return null;

  try {
    const session = await refreshRequest(storedRefreshToken);
    await useAuthStore.getState().setSession(session);
    return session.accessToken;
  } catch {
    await clearStoredRefreshToken();
    await useAuthStore.getState().clearSession();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      pendingRefresh ??= refreshAccessToken().finally(() => {
        pendingRefresh = null;
      });
      const newAccessToken = await pendingRefresh;

      if (newAccessToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return apiClient.request(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
