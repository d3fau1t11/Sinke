import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ZoneState {
  selectedZoneId: string | null;
  selectedZoneName: string;
  selectedZoneNameAm: string;
  deliveryFee: number;
  userCoords: { latitude: number; longitude: number } | null;
  setZone: (zoneId: string, name: string, nameAm: string, fee: number) => void;
  setUserCoords: (coords: { latitude: number; longitude: number }) => void;
  clearZone: () => void;
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set) => ({
      selectedZoneId: null,
      selectedZoneName: "",
      selectedZoneNameAm: "",
      deliveryFee: 0,
      userCoords: null,

      setZone: (zoneId, name, nameAm, fee) =>
        set({
          selectedZoneId: zoneId,
          selectedZoneName: name,
          selectedZoneNameAm: nameAm,
          deliveryFee: fee,
        }),

      setUserCoords: (coords) => set({ userCoords: coords }),

      clearZone: () =>
        set({
          selectedZoneId: null,
          selectedZoneName: "",
          selectedZoneNameAm: "",
          deliveryFee: 0,
          userCoords: null,
        }),
    }),
    {
      name: "senik-zone",
    },
  ),
);
