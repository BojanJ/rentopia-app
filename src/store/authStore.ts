import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PROPERTY_OWNER' | 'TENANT' | 'SERVICE_PROVIDER';
  profileImageUrl?: string;
}

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false
        }),

      setUser: (user) => set({ user }),

      setToken: (token) => 
        set({ 
          token, 
          isAuthenticated: !!token 
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'rentopia-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
