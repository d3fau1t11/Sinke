import React, { useState, useEffect } from "react";
import { zonesApi } from "@senik/api";
import { Card } from "@senik/ui";
import type { ZoneListItem } from "@senik/types";

export function AdminZonesScreen() {
  const [zones, setZones] = useState<ZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadZones = async () => {
    try {
      const data = await zonesApi.getZones();
      setZones(data);
    } catch (err) {
      console.error("Failed to load zones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadZones();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hyperlocal Delivery Zones
        </h1>
        <p className="text-xs text-slate-400">
          Coverage areas, delivery fees, and estimated transit times
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading delivery zones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              variant="outlined"
              padding="lg"
              className="bg-slate-900 border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">
                    {zone.name_en}
                  </h3>
                  <p className="text-xs text-slate-400">{zone.name_am}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Active
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subcity:</span>
                  <span className="text-slate-200 font-medium">
                    {zone.subcity_en}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Delivery Fee:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {zone.delivery_fee} ETB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard ETA:</span>
                  <span className="text-slate-200 font-medium">
                    {zone.delivery_eta}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-primary">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                <span>Supported by Bajaj & Motor dispatch</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
