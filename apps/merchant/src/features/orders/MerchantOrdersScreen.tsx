import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import type { OrderSummary, OrderStatus } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { OrderCard } from "./OrderCard";

type FilterTab = "all" | "placed" | "preparing" | "ready" | "completed";

export function MerchantOrdersScreen() {
  const { merchantId } = useMerchantAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("placed");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    if (!merchantId) return;
    try {
      const data = await ordersApi.getByBusiness(merchantId);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

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

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed")
      return o.status === "delivered" || o.status === "cancelled";
    if (activeTab === "preparing")
      return o.status === "preparing" || o.status === "accepted";
    return o.status === activeTab;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">Manage Orders</h2>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="text-xs text-primary font-semibold hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {(
          ["placed", "preparing", "ready", "completed", "all"] as FilterTab[]
        ).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-surface text-on-surface-variant hover:bg-outline/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">
            receipt_long
          </span>
          <p className="text-sm font-semibold text-on-surface">
            No orders in this status
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            New customer orders will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              updatingId={updatingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
