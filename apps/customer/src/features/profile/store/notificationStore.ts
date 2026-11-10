import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  orderUpdates: boolean;
  offers: boolean;
  setPreference: (name: 'orderUpdates' | 'offers', enabled: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      orderUpdates: true,
      offers: false,
      setPreference: (name, enabled) => set({ [name]: enabled }),
    }),
    { name: 'senik-notification-preferences' },
  ),
);
