import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import { Card } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";

export function DeliveryHistoryScreen() {
  const { riderId } = useRiderAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!riderId) return;
      try {
        const data = await ordersApi.getRiderOrders(riderId);
        setOrders(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [riderId]);

  const delivered = orders.filter((o) => o.status === "delivered");
  const totalEarned = delivered.reduce(
    (acc, o) => acc + (o.delivery_fee || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Delivery History</h2>
        <p className="text-xs text-on-surface-variant">
          Your completed trips and earnings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card
          variant="outlined"
          padding="md"
          className="bg-emerald-50/50 border-emerald-200"
        >
          <p className="text-xs font-semibold text-emerald-700">
            COMPLETED TRIPS
          </p>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            {delivered.length}
          </p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="bg-green-50/50 border-green-200"
        >
          <p className="text-xs font-semibold text-green-700">TOTAL EARNINGS</p>
          <p className="text-2xl font-black text-green-800 mt-1">
            {formatETB(totalEarned)}
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant">
            Loading trip history...
          </p>
        </div>
      ) : delivered.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10">
          <p className="text-sm font-semibold text-on-surface">
            No completed deliveries yet
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Deliveries you finish will be recorded here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {delivered.map((order) => (
            <Card
              key={order.id}
              variant="outlined"
              padding="sm"
              className="space-y-1"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-secondary">
                  #{order.order_number}
                </span>
                <span className="font-bold text-green-700">
                  +{formatETB(order.delivery_fee)}
                </span>
              </div>
              <p className="text-xs text-on-surface font-medium truncate">
                {order.business?.name_en} ➔ {order.delivery_address}
              </p>
              <p className="text-[10px] text-on-surface-variant">
                {new Date(order.created_at).toLocaleDateString()}{" "}
                {new Date(order.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
