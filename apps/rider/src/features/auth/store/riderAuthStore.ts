import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { endDemoSession, isDemoSession, signOutStaff, setRiderAvailability } from '@senik/api';

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
  logout: () => Promise<void>;
}

export const useRiderAuthStore = create<RiderAuthState>()(
  persist(
    (set) => ({
      riderId: null,
      riderName: '',
      phone: '',
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

      logout: async () => {
        if (!isDemoSession()) {
          await setRiderAvailability(false);
          await signOutStaff();
        }
        endDemoSession();
        set({
          riderId: null,
          riderName: '',
          phone: '',
          isOnline: false,
          isAuthenticated: false,
          currentCoords: null,
        });
      },
    }),
    {
      name: 'senik-rider-demo-auth-v1',
    },
  ),
);
