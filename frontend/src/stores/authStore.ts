import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  hasHydrated: boolean;
  _setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (t) => set({ token: t }),
      logout: () => set({ token: null }),
      hasHydrated: false,
      _setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        // called after state is rehydrated from localStorage
        state?._setHydrated();
      },
    }
  )
);

