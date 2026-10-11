import React, { useEffect } from "react";
import { useRiderAuthStore } from "../features/auth/store/riderAuthStore";

export function RiderHeader() {
  const { riderName, isOnline, setIsOnline, setCoords, logout } =
    useRiderAuthStore();

  useEffect(() => {
    if (!isOnline) return;
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 },
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline, setCoords]);

  return (
    <header className="bg-surface border-b border-outline/10 sticky top-0 z-20 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center text-xl">
            🚴
          </div>
          <div>
            <h1 className="font-bold text-base text-on-surface leading-tight">
              {riderName || "Rider"}
            </h1>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 transition-colors ${
                isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              {isOnline ? "ONLINE (GPS Active)" : "OFFLINE"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="text-xs text-on-surface-variant hover:text-error transition-colors px-2 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
