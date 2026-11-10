import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { endDemoSession, isDemoSession, signOutStaff } from '@senik/api';

interface MerchantAuthState {
  merchantId: string | null;
  businessName: string;
  businessNameAm: string;
  isOpen: boolean;
  isAuthenticated: boolean;
  setMerchant: (id: string, name: string, nameAm: string, isOpen: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  logout: () => Promise<void>;
}

export const useMerchantAuthStore = create<MerchantAuthState>()(
  persist(
    (set) => ({
      merchantId: null,
      businessName: '',
      businessNameAm: '',
      isOpen: true,
      isAuthenticated: false,

      setMerchant: (id, name, nameAm, isOpen) =>
        set({
          merchantId: id,
          businessName: name,
          businessNameAm: nameAm,
          isOpen,
          isAuthenticated: true,
        }),

      setIsOpen: (isOpen) => set({ isOpen }),

      logout: async () => {
        if (!isDemoSession()) await signOutStaff();
        endDemoSession();
        set({
          merchantId: null,
          businessName: '',
          businessNameAm: '',
          isOpen: true,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'senik-merchant-demo-auth-v1',
    },
  ),
);
