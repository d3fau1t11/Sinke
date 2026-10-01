import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ZoneState {
  selectedZoneId: string | null;
  selectedZoneName: string;
  selectedZoneNameAm: string;
  deliveryFee: number;
  setZone: (zoneId: string, name: string, nameAm: string, fee: number) => void;
  clearZone: () => void;
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set) => ({
      selectedZoneId: null,
      selectedZoneName: '',
      selectedZoneNameAm: '',
      deliveryFee: 0,

      setZone: (zoneId, name, nameAm, fee) =>
        set({ selectedZoneId: zoneId, selectedZoneName: name, selectedZoneNameAm: nameAm, deliveryFee: fee }),

      clearZone: () =>
        set({ selectedZoneId: null, selectedZoneName: '', selectedZoneNameAm: '', deliveryFee: 0 }),
    }),
    {
      name: 'senik-zone',
    }
  )
);
