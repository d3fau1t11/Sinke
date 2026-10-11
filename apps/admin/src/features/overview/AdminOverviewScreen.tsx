import React, { useState, useEffect } from "react";
import { ordersApi, businessesApi, zonesApi } from "@senik/api";
import { Card } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary, Business, ZoneListItem } from "@senik/types";

export function AdminOverviewScreen() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [zones, setZones] = useState<ZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, bizData, zoneData] = await Promise.all([
          ordersApi.getAll(),
          businessesApi.getAll(),
          zonesApi.getZones(),
        ]);
        setOrders(ordersData);
        setBusinesses(bizData);
        setZones(zoneData);
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const openMerchants = businesses.filter((b) => b.is_open).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-sm text-slate-400">
          Live network activity across all Ethiopian zones
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          variant="outlined"
          padding="md"
          className="bg-slate-900 border-slate-800"
        >
          <p className="text-xs font-semibold text-slate-400">
            TOTAL PLATFORM GMV
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {formatETB(totalGMV)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Across all orders</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="bg-slate-900 border-slate-800"
        >
          <p className="text-xs font-semibold text-slate-400">TOTAL ORDERS</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {orders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Processed orders</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="bg-slate-900 border-slate-800"
        >
          <p className="text-xs font-semibold text-slate-400">
            MERCHANTS ONLINE
          </p>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {openMerchants} / {businesses.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Accepting orders</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="bg-slate-900 border-slate-800"
        >
          <p className="text-xs font-semibold text-slate-400">ACTIVE ZONES</p>
          <p className="text-2xl font-black text-purple-400 mt-1">
            {zones.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Koye, Tulu Dimtu, Akaki
          </p>
        </Card>
      </div>

      <Card
        variant="outlined"
        padding="lg"
        className="bg-slate-900 border-slate-800 space-y-4"
      >
        <h3 className="font-bold text-white text-base">
          Recent Platform Activity
        </h3>
        {loading ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Loading live orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No customer orders placed yet.
          </p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-primary mr-2">
                    #{order.order_number}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {order.business?.name_en}
                  </span>
                  <span className="text-slate-500 ml-2">
                    ➔ {order.delivery_address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400">
                    {formatETB(order.total)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-700 text-slate-200">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
