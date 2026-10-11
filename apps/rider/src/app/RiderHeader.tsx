import React, { useEffect } from "react";
import { useRiderAuthStore } from "../features/auth/store/riderAuthStore";
import { useRiderWalletStore } from "../features/earnings/store/riderWalletStore";
import { formatETB } from "@senik/utils";
import { SenikLogo } from "@senik/ui";

export function RiderHeader() {
  const { riderName, isOnline, setIsOnline, setCoords, logout } =
    useRiderAuthStore();
  const { balance } = useRiderWalletStore();

  useEffect(() => {
    if (!isOnline) return;
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) =>
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 },
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline, setCoords]);

  return (
    <header className="bg-surface border-b border-outline/10 sticky top-0 z-20 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SenikLogo size="md" />
            <span className="absolute -bottom-1 -right-1 text-xs">🚴</span>
          </div>
          <div>
            <h1 className="font-bold text-base text-on-surface leading-tight">
              {riderName || "Rider"}
            </h1>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 transition-all ${
                isOnline
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              {isOnline ? "ONLINE" : "OFFLINE"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] font-semibold text-on-surface-variant">
              Balance
            </p>
            <p className="font-mono font-bold text-sm text-green-600">
              {formatETB(balance)}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-[11px] text-on-surface-variant hover:text-error transition-colors ml-2 px-2 py-1 rounded-lg hover:bg-error/10"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
