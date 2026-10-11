import React, { useState, useEffect } from "react";
import { businessesApi } from "@senik/api";
import { Card } from "@senik/ui";
import type { Business } from "@senik/types";

export function AdminMerchantsScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadMerchants = async () => {
    try {
      const data = await businessesApi.getAll();
      setBusinesses(data);
    } catch (err) {
      console.error("Failed to load merchants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMerchants();
  }, []);

  const handleToggleOpen = async (biz: Business) => {
    setTogglingId(biz.id);
    try {
      await businessesApi.setIsOpen(biz.id, !biz.is_open);
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === biz.id ? { ...b, is_open: !biz.is_open } : b,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle merchant status", err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Merchant Partners</h1>
          <p className="text-xs text-slate-400">
            Manage store listings, operational status, and partners
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadMerchants()}
          className="text-xs text-primary font-semibold hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading merchants...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <Card
              key={biz.id}
              variant="outlined"
              padding="md"
              className="bg-slate-900 border-slate-800 flex items-center gap-3"
            >
              <img
                src={biz.avatar_image}
                alt={biz.name_en}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white truncate">
                    {biz.name_en}
                  </h3>
                  <span className="text-[11px] text-amber-400 font-bold flex items-center">
                    ★ {biz.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{biz.name_am}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fee: {biz.delivery_fee} ETB • ETA: {biz.delivery_eta}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <button
                  type="button"
                  disabled={togglingId === biz.id}
                  onClick={() => void handleToggleOpen(biz)}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                    biz.is_open
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                      : "bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900"
                  }`}
                >
                  {togglingId === biz.id
                    ? "..."
                    : biz.is_open
                      ? "OPEN"
                      : "CLOSED"}
                </button>
                <span className="text-[10px] text-slate-500">
                  Click to switch
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
