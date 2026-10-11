import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminAuthState {
  adminName: string;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminName: "Senik Administrator",
      isAuthenticated: false,

      login: (name) =>
        set({
          adminName: name || "Senik Administrator",
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
        }),
    }),
    {
      name: "senik-admin-auth",
    },
  ),
);
