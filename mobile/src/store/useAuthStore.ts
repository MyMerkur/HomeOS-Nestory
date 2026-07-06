import { create } from 'zustand';
import {
  clearStoredRefreshToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
} from '../services/secureStorage';
import { refreshRequest, type AuthSession, type AuthUser } from '../modules/auth/services/authApi';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isBootstrapping: boolean;
  setSession: (session: AuthSession) => Promise<void>;
  clearSession: () => Promise<void>;
  bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapping: true,

  setSession: async (session) => {
    await setStoredRefreshToken(session.refreshToken);
    set({ user: session.user, accessToken: session.accessToken });
  },

  clearSession: async () => {
    await clearStoredRefreshToken();
    set({ user: null, accessToken: null });
  },

  bootstrap: async () => {
    const storedRefreshToken = await getStoredRefreshToken();

    if (!storedRefreshToken) {
      set({ isBootstrapping: false });
      return;
    }

    try {
      const session = await refreshRequest(storedRefreshToken);
      await setStoredRefreshToken(session.refreshToken);
      set({ user: session.user, accessToken: session.accessToken, isBootstrapping: false });
    } catch {
      await clearStoredRefreshToken();
      set({ user: null, accessToken: null, isBootstrapping: false });
    }
  },
}));

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
