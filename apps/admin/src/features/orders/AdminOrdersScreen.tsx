import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import type { OrderSummary, OrderStatus } from "@senik/types";
import { AdminOrderRow } from "./AdminOrderRow";

export function AdminOrdersScreen() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Live Orders Oversight
          </h1>
          <p className="text-xs text-slate-400">
            Control and manage order lifecycle across all areas
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="text-xs text-primary font-semibold hover:underline"
        >
          Refresh Feed
        </button>
      </div>

      <div className="flex gap-2">
        {[
          "all",
          "placed",
          "preparing",
          "ready",
          "picked_up",
          "delivered",
          "cancelled",
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Merchant</th>
                <th className="py-3 px-3">Destination</th>
                <th className="py-3 px-3">Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Force Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    No orders in this status category.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <AdminOrderRow
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    updatingId={updatingId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
