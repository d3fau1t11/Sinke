import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RiderAuthState {
  riderId: string | null;
  riderName: string;
  phone: string;
  isOnline: boolean;
  isAuthenticated: boolean;
  currentCoords: { latitude: number; longitude: number } | null;
  setRider: (id: string, name: string, phone: string) => void;
  setIsOnline: (online: boolean) => void;
  setCoords: (coords: { latitude: number; longitude: number }) => void;
  logout: () => void;
}

export const useRiderAuthStore = create<RiderAuthState>()(
  persist(
    (set) => ({
      riderId: null,
      riderName: "",
      phone: "",
      isOnline: true,
      isAuthenticated: false,
      currentCoords: null,

      setRider: (id, name, phone) =>
        set({
          riderId: id,
          riderName: name,
          phone,
          isAuthenticated: true,
          isOnline: true,
        }),

      setIsOnline: (online) => set({ isOnline: online }),

      setCoords: (coords) => set({ currentCoords: coords }),

      logout: () =>
        set({
          riderId: null,
          riderName: "",
          phone: "",
          isOnline: false,
          isAuthenticated: false,
          currentCoords: null,
        }),
    }),
    {
      name: "senik-rider-auth",
    },
  ),
);
