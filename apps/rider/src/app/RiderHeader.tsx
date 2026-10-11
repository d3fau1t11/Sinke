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
    <header className="bg-surface sticky top-0 z-20 border-b border-outline-variant">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <SenikLogo size="md" />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-title-sm text-on-surface leading-tight truncate">
              {riderName || "Rider"}
            </h1>
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              aria-pressed={isOnline}
              className={`inline-flex items-center gap-1.5 text-micro font-bold uppercase tracking-[0.05em] px-2.5 py-1 rounded-full mt-1 transition-colors ${
                isOnline
                  ? "bg-secondary/10 text-secondary hover:bg-secondary/15"
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-secondary animate-pulse" : "bg-outline"}`}
              />
              {isOnline ? "Online" : "Offline"}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="text-right">
            <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
              Balance
            </p>
            {/* Money is always green */}
            <p className="font-mono font-bold text-body-sm text-secondary tabular-nums">
              {formatETB(balance)}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
            aria-label="Log out"
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </button>
        </div>
      </div>
      {/* Tibeb accent strip */}
      <div className="h-0.5 tibeb-accent-strip" aria-hidden="true" />
    </header>
  );
}
