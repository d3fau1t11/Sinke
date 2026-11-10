import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { endDemoSession, isDemoSession, signOutStaff } from '@senik/api';


interface AdminAuthState {
  adminName: string;
  adminEmail: string;
  adminRole: string;
  isAuthenticated: boolean;
  loginError: string;
  loginDemo: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminName: '',
      adminEmail: '',
      adminRole: '',
      isAuthenticated: false,
      loginError: '',

      loginDemo: () =>
        set({
          adminName: 'Super Admin',
          adminEmail: 'admin@senik.et',
          adminRole: 'Super Admin',
          isAuthenticated: true,
          loginError: '',
        }),

      logout: async () => {
        if (!isDemoSession()) await signOutStaff();
        endDemoSession();
        set({
          adminName: '',
          adminEmail: '',
          adminRole: '',
          isAuthenticated: false,
        });
      },

      clearError: () => set({ loginError: '' }),
    }),
    { name: 'senik-admin-demo-auth-v1' },
  ),
);
