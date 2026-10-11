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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <h2 className="text-xl font-bold text-on-surface">Available Jobs</h2>
          <p className="text-xs text-on-surface-variant">
            Orders ready for pickup near you
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDeliveries()}
          className="flex items-center gap-1 text-xs text-green-600 font-bold hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Refresh
        </button>
      </div>

      {!isOnline && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
          <span className="text-base">⚠️</span>
          <p>
            You are <strong>OFFLINE</strong>. Tap your status badge in the
            header to go online and accept jobs.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-on-surface-variant">
            Scanning for nearby orders...
          </p>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10">
          <span className="text-5xl block mb-3">🛺</span>
          <p className="text-sm font-bold text-on-surface">
            No orders ready for pickup
          </p>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
            When merchants mark orders ready, they'll appear here instantly.
          </p>
          <button
            type="button"
            onClick={() => void loadDeliveries()}
            className="mt-4 text-xs text-green-600 font-bold underline"
          >
            Check again
          </button>
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
