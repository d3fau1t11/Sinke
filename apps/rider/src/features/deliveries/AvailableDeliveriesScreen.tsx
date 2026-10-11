import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";
import { DeliveryCard } from "./DeliveryCard";

export function AvailableDeliveriesScreen() {
  const navigate = useNavigate();
  const { riderId, isOnline } = useRiderAuthStore();
  const [deliveries, setDeliveries] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const loadDeliveries = async () => {
    try {
      const data = await ordersApi.getAvailableForRiders();
      setDeliveries(data);
    } catch (err) {
      console.error("Failed to load available deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDeliveries();
    const interval = setInterval(loadDeliveries, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (orderId: string) => {
    if (!riderId) return;
    setAcceptingId(orderId);
    try {
      await ordersApi.acceptDelivery(orderId, riderId);
      navigate("/active");
    } catch (err) {
      console.error("Failed to accept delivery", err);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            Available Deliveries
          </h2>
          <p className="text-xs text-on-surface-variant">
            Nearby orders waiting for dispatch
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDeliveries()}
          className="text-xs text-secondary font-semibold hover:underline"
        >
          Refresh
        </button>
      </div>

      {!isOnline && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          ⚠️ You are currently <strong>OFFLINE</strong>. Turn on your status in
          the header to accept deliveries.
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant">
            Finding available orders...
          </p>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">
            moped
          </span>
          <p className="text-sm font-semibold text-on-surface">
            No orders ready for pickup
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            As soon as merchants prepare orders, they will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((order) => (
            <DeliveryCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              acceptingId={acceptingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
