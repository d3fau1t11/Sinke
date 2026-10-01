import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@senik/api';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  role: string;
  zone_id: string | null;
  created_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  session: { access_token: string; expires_at?: number } | null;
  setSession: (session: { access_token: string; expires_at?: number } | null) => void;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      session: null,

      setSession: (session) =>
        set({ session, isAuthenticated: !!session }),

      setUser: (user) => set({ user }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, user: null, session: null });
      },
    }),
    {
      name: 'senik-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        session: state.session,
      }),
    }
  )
);