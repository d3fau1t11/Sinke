import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@senik/api";
import { Button, Card, Skeleton, EmptyState } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";
import { useRiderWalletStore } from "../earnings/store/riderWalletStore";
import { StepIndicator } from "./StepIndicator";

export function ActiveDeliveryScreen() {
  const navigate = useNavigate();
  const { riderId } = useRiderAuthStore();
  const { creditDelivery } = useRiderWalletStore();
  const [activeOrder, setActiveOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const loadActiveOrder = async () => {
    if (!riderId) return;
    try {
      const orders = await ordersApi.getRiderOrders(riderId);
      const pickedUp = orders.find((o) => o.status === "picked_up");
      const accepted = orders.find((o) => o.status === "accepted");
      if (pickedUp) {
        setActiveOrder(pickedUp);
        setStep(1);
      } else if (accepted) {
        setActiveOrder(accepted);
        setStep(0);
      } else setActiveOrder(null);
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

  const handlePickedUp = async () => {
    if (!activeOrder) return;
    setUpdating(true);
    try {
      await ordersApi.updateStatus(activeOrder.id, "picked_up");
      setStep(1);
      setActiveOrder((o) => (o ? { ...o, status: "picked_up" } : null));
    } catch (err) {
      console.error("Failed to mark picked up", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!activeOrder || !riderId) return;
    setUpdating(true);
    try {
      await ordersApi.updateStatus(activeOrder.id, "delivered");
      creditDelivery(riderId, activeOrder.delivery_fee ?? 0);
      setStep(2);
      setTimeout(() => navigate("/earnings"), 1200);
    } catch (err) {
      console.error("Failed to mark delivered", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" width="140px" />
        <Skeleton variant="rectangular" height="72px" />
        <Skeleton variant="rectangular" height="220px" />
        <Skeleton variant="rectangular" height="56px" />
      </div>
    );
  }

  if (step === 2 && activeOrder) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-[44px] fill-icon">
            check_circle
          </span>
        </div>
        <h3 className="font-display font-black text-title-lg text-on-surface">
          Delivered!
        </h3>
        {/* Money earned — green */}
        <p className="font-display font-bold text-title-md text-secondary tabular-nums">
          +{formatETB(activeOrder.delivery_fee)} added to your balance
        </p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <EmptyState
        t={(k) => k}
        isAm={false}
        title="No Active Delivery"
        message="Accept an available job to start delivering."
        actionLabel="Browse Available Jobs"
        onAction={() => navigate("/deliveries")}
        icon={
          <span className="material-symbols-outlined text-[40px]">
            two_wheeler
          </span>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="text-micro font-bold uppercase tracking-[0.08em] text-primary">
          In Progress
        </span>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          Order #{activeOrder.order_number}
        </h2>
      </div>

      <StepIndicator step={step} />

      {/* Route card */}
      <Card padding="none">
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-outline-variant/60">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">
                store
              </span>
            </div>
            <div>
              <p className="text-micro font-bold uppercase text-on-surface-variant tracking-wide">
                Pickup From
              </p>
              <p className="font-bold text-body-sm text-on-surface">
                {activeOrder.business?.name_en}
              </p>
              <p className="text-body-sm text-on-surface-variant">
                {activeOrder.business?.name_am}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed/50 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[18px]">
                pin_drop
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-micro font-bold uppercase text-on-surface-variant tracking-wide">
                Deliver to
              </p>
              <p className="font-bold text-body-sm text-on-surface">
                {activeOrder.delivery_address}
              </p>
              {activeOrder.delivery_notes && (
                <p className="text-body-sm text-on-surface-variant mt-1 bg-surface-container-low rounded-xl px-2.5 py-1.5 inline-block">
                  {activeOrder.delivery_notes}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-surface-container-low flex justify-between items-center gap-3">
          <div>
            <p className="text-micro text-on-surface-variant uppercase tracking-wide">
              Payment
            </p>
            <p className="font-bold text-body-sm text-on-surface">
              {activeOrder.payment_method === "cash" ? (
                <span className="tabular-nums">
                  {formatETB(activeOrder.total)} (Cash)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-secondary">
                  <span className="material-symbols-outlined text-[15px] fill-icon">
                    check_circle
                  </span>
                  Paid Online
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-micro text-on-surface-variant uppercase tracking-wide">
              Your Earnings
            </p>
            {/* Money — green */}
            <p className="font-display font-black text-title-md text-secondary tabular-nums">
              +{formatETB(activeOrder.delivery_fee)}
            </p>
          </div>
        </div>
      </Card>

      {/* One dominant action for the current step */}
      {step === 0 ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={updating}
          onClick={() => void handlePickedUp()}
        >
          <span className="material-symbols-outlined text-[20px]">
            package_2
          </span>
          {updating ? "Updating..." : "Mark as Picked Up"}
        </Button>
      ) : (
        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={updating}
            onClick={() => void handleMarkDelivered()}
          >
            <span className="material-symbols-outlined text-[20px] fill-icon">
              task_alt
            </span>
            {updating ? "Completing..." : "Mark as Delivered"}
          </Button>
          <p className="text-center text-body-sm text-secondary font-semibold tabular-nums">
            You'll earn +{formatETB(activeOrder.delivery_fee)}
          </p>
        </div>
      )}
    </div>
  );
}
