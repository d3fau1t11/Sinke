import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import { Card, StatusBadge, Skeleton, EmptyState } from "@senik/ui";
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
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          Delivery History
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Your completed trips and earnings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card padding="md">
          <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
            Completed Trips
          </p>
          <p className="font-display font-black text-title-xl text-on-surface mt-1 tabular-nums">
            {delivered.length}
          </p>
        </Card>
        {/* Money — green */}
        <Card padding="md" className="bg-secondary/5">
          <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
            Total Earnings
          </p>
          <p className="font-display font-black text-title-xl text-secondary mt-1 tabular-nums">
            {formatETB(totalEarned)}
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton variant="rectangular" height="64px" />
          <Skeleton variant="rectangular" height="64px" />
          <Skeleton variant="rectangular" height="64px" />
        </div>
      ) : delivered.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title="No completed deliveries yet"
          message="Deliveries you finish will be recorded here."
          icon={
            <span className="material-symbols-outlined text-[40px]">
              two_wheeler
            </span>
          }
        />
      ) : (
        <div className="space-y-2">
          {delivered.map((order) => (
            <Card key={order.id} padding="sm" className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="font-mono font-bold text-body-sm text-on-surface">
                  #{order.order_number}
                </span>
                {/* Money — green */}
                <span className="font-mono font-bold text-body-sm text-secondary tabular-nums">
                  +{formatETB(order.delivery_fee)}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant truncate flex items-center gap-1">
                <span className="truncate">{order.business?.name_en}</span>
                <span className="material-symbols-outlined text-[13px] shrink-0">
                  arrow_forward
                </span>
                <span className="truncate">{order.delivery_address}</span>
              </p>
              <div className="flex justify-between items-center gap-2">
                <span className="text-label-sm text-on-surface-variant/70 tabular-nums">
                  {new Date(order.created_at).toLocaleDateString()}{" "}
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <StatusBadge tone="success">Delivered</StatusBadge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
