import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { Skeleton, EmptyState } from "@senik/ui";
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-title-lg text-on-surface">
            Available Jobs
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Orders ready for pickup near you
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDeliveries()}
          className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-level-1 flex items-center justify-center text-primary active:scale-95 transition-all shrink-0"
          aria-label="Refresh jobs"
        >
          <span className="material-symbols-outlined text-[19px]">refresh</span>
        </button>
      </div>

      {!isOnline && (
        <div className="flex items-start gap-2.5 p-3.5 bg-tertiary-fixed/40 rounded-2xl text-tertiary">
          <span className="material-symbols-outlined text-[19px] shrink-0 mt-0.5">
            wifi_off
          </span>
          <p className="text-body-sm leading-snug">
            You are <strong>offline</strong>. Tap your status badge in the
            header to go online and accept jobs.
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl shadow-level-1 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton variant="text" width="100px" />
                <Skeleton variant="text" width="72px" height="24px" />
              </div>
              <Skeleton variant="text" lines={2} />
            </div>
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title="No orders ready for pickup"
          message="When merchants mark orders ready, they'll appear here instantly."
          actionLabel="Check again"
          onAction={() => void loadDeliveries()}
          icon={
            <span className="material-symbols-outlined text-[40px]">
              two_wheeler
            </span>
          }
        />
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
