import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { useAuthStore } from '../store/useAuthStore';

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

// Sprint 1 (Mobile Auth) ile refresh-token akışı bu interceptor'a eklenecek.
