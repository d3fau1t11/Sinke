import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEMO_ADMINS = [
  {
    email: "admin@senik.et",
    password: "senik2025",
    name: "Super Admin",
    role: "Super Admin",
  },
  {
    email: "ops@senik.et",
    password: "ops2025",
    name: "Operations Manager",
    role: "Operations",
  },
];

interface AdminAuthState {
  adminName: string;
  adminEmail: string;
  adminRole: string;
  isAuthenticated: boolean;
  loginError: string;
  login: (email: string, password: string) => boolean;
  loginDemo: () => void;
  logout: () => void;
  clearError: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      adminName: "",
      adminEmail: "",
      adminRole: "",
      isAuthenticated: false,
      loginError: "",

      login: (email, password) => {
        const admin = DEMO_ADMINS.find(
          (a) =>
            a.email.toLowerCase() === email.toLowerCase() &&
            a.password === password,
        );
        if (admin) {
          set({
            adminName: admin.name,
            adminEmail: admin.email,
            adminRole: admin.role,
            isAuthenticated: true,
            loginError: "",
          });
          return true;
        }
        set({
          loginError:
            "Invalid email or password. Check credentials and try again.",
        });
        return false;
      },

      loginDemo: () =>
        set({
          adminName: "Super Admin",
          adminEmail: "admin@senik.et",
          adminRole: "Super Admin",
          isAuthenticated: true,
          loginError: "",
        }),

      logout: () =>
        set({
          adminName: "",
          adminEmail: "",
          adminRole: "",
          isAuthenticated: false,
        }),

      clearError: () => set({ loginError: "" }),
    }),
    { name: "senik-admin-auth" },
  ),
);
