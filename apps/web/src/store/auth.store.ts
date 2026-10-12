/**
 * Auth store — Zustand.
 * Holds the authenticated user, access token, and login/logout actions.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api-client';
import type { LoginDto, RegisterDto } from '@kanishka/shared-types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  // Actions
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      login: async (dto) => {
        set({ isLoading: true });
        try {
          const res = await authApi.login(dto);
          localStorage.setItem('accessToken', res.accessToken);
          set({ user: res.user as AuthUser, accessToken: res.accessToken, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (dto) => {
        set({ isLoading: true });
        try {
          const res = await authApi.register(dto);
          localStorage.setItem('accessToken', res.accessToken);
          set({ user: res.user as AuthUser, accessToken: res.accessToken, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
        window.location.href = '/';
      },

      setUser: (user) => set({ user }),
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null });
      },

      isAuthenticated: () => !!get().user,
      isAdmin: () => ['ADMIN', 'SUPER_ADMIN'].includes(get().user?.role ?? ''),
    }),
    {
      name: 'kanishka-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    },
  ),
);
