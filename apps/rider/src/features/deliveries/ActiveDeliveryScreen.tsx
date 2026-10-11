import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@senik/api";
import { Card, Button } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";

export function ActiveDeliveryScreen() {
  const navigate = useNavigate();
  const { riderId } = useRiderAuthStore();
  const [activeOrder, setActiveOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadActiveOrder = async () => {
    if (!riderId) return;
    try {
      const orders = await ordersApi.getRiderOrders(riderId);
      const active = orders.find((o) => o.status === "picked_up");
      setActiveOrder(active || null);
    } catch (err) {
      console.error("Failed to load active delivery", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActiveOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riderId]);

  const handleMarkDelivered = async () => {
    if (!activeOrder) return;
    setUpdating(true);
    try {
      await ordersApi.updateStatus(activeOrder.id, "delivered");
      setActiveOrder(null);
      navigate("/history");
    } catch (err) {
      console.error("Failed to mark delivered", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-on-surface-variant">
          Checking active delivery...
        </p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10 space-y-3">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant block">
          task_alt
        </span>
        <h3 className="font-bold text-on-surface">No Active Delivery</h3>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
          You don't have an order in progress. Accept an available job to start
          delivering.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/deliveries")}
        >
          Browse Available Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            In Progress
          </span>
          <h2 className="text-xl font-bold text-on-surface">
            Delivery #{activeOrder.order_number}
          </h2>
        </div>
        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
          +{formatETB(activeOrder.delivery_fee)}
        </span>
      </div>

      <Card variant="outlined" padding="md" className="space-y-3">
        <div className="flex items-start gap-2 border-b border-outline/10 pb-3">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
            store
          </span>
          <div>
            <p className="font-bold text-sm text-on-surface">
              {activeOrder.business?.name_en}
            </p>
            <p className="text-xs text-on-surface-variant">
              {activeOrder.business?.name_am}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 border-b border-outline/10 pb-3">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">
            pin_drop
          </span>
          <div>
            <p className="font-bold text-sm text-on-surface">
              {activeOrder.delivery_address}
            </p>
            {activeOrder.delivery_notes && (
              <p className="text-xs text-amber-700 mt-0.5">
                Note: {activeOrder.delivery_notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 text-xs text-on-surface-variant">
          <span>Payment to Collect:</span>
          <span className="font-bold text-sm text-on-surface">
            {activeOrder.payment_method === "cash"
              ? `${formatETB(activeOrder.total)} (Cash)`
              : "Paid Online"}
          </span>
        </div>
      </Card>

      <Button
        variant="primary"
        className="w-full py-3.5 text-base font-bold bg-green-600 hover:bg-green-700"
        disabled={updating}
        onClick={() => void handleMarkDelivered()}
      >
        {updating ? "Updating..." : "✓ Complete & Mark Delivered"}
      </Button>
    </div>
  );
}
