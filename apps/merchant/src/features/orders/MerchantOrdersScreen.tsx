import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ordersApi } from "@senik/api";
import type { OrderSummary, OrderStatus } from "@senik/types";
import { Skeleton, EmptyState, Button } from "@senik/ui";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { OrderCard } from "./OrderCard";

type FilterTab = "all" | "placed" | "preparing" | "ready" | "completed";

const TABS: FilterTab[] = ["placed", "preparing", "ready", "completed", "all"];

const TAB_LABELS: Record<FilterTab, { en: string; am: string }> = {
  placed: { en: "Incoming", am: "አዲስ" },
  preparing: { en: "Preparing", am: "በዝግጅት" },
  ready: { en: "Ready", am: "ዝግጁ" },
  completed: { en: "Done", am: "ተከፍሏል" },
  all: { en: "All", am: "ሁሉም" },
};

export function MerchantOrdersScreen() {
  const { merchantId } = useMerchantAuthStore();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>(() => {
    const param = searchParams.get("tab") as FilterTab | null;
    return param && TABS.includes(param) ? param : "placed";
  });
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

  const countFor = (tab: FilterTab) =>
    orders.filter((o) => {
      if (tab === "all") return true;
      if (tab === "completed")
        return o.status === "delivered" || o.status === "cancelled";
      if (tab === "preparing")
        return o.status === "preparing" || o.status === "accepted";
      return o.status === tab;
    }).length;

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
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          Manage Orders
        </h2>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-level-1 flex items-center justify-center text-primary active:scale-95 transition-all"
          aria-label="Refresh orders"
        >
          <span className="material-symbols-outlined text-[19px]">refresh</span>
        </button>
      </div>

      {/* Pipeline filter chips with live counts */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`px-3.5 py-1.5 rounded-full text-body-sm font-semibold whitespace-nowrap transition-all tabular-nums ${
              activeTab === tab
                ? "bg-primary text-on-primary shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {TAB_LABELS[tab].en} ({countFor(tab)})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-2xl shadow-level-1 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="80px" height="22px" />
              </div>
              <Skeleton variant="text" lines={2} />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title="No orders in this status"
          message="New customer orders will appear here in real-time."
          icon={
            <span className="material-symbols-outlined text-[40px]">
              receipt_long
            </span>
          }
        />
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

      {!loading && filteredOrders.length === 0 && activeTab === "placed" && (
        <div className="text-center">
          <Button size="sm" variant="secondary" onClick={() => setActiveTab("all")}>
            View all orders instead
          </Button>
        </div>
      )}
    </div>
  );
}
