import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@senik/api";
import { Button } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";
import { useRiderWalletStore } from "../earnings/store/riderWalletStore";

const STEPS = ["Accepted", "Picked Up", "Delivered"] as const;

function StepIndicator({ step }: { step: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, idx) => (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                idx < step
                  ? "bg-green-600 border-green-600 text-white"
                  : idx === step
                    ? "bg-green-100 border-green-600 text-green-700"
                    : "bg-surface border-outline/20 text-on-surface-variant"
              }`}
            >
              {idx < step ? "✓" : idx + 1}
            </div>
            <span
              className={`text-[10px] font-semibold mt-1 ${idx === step ? "text-green-600" : "text-on-surface-variant"}`}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`w-12 h-0.5 mb-5 mx-1 transition-all ${idx < step ? "bg-green-600" : "bg-outline/20"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

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
      <div className="text-center py-16">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-on-surface-variant">
          Checking active delivery...
        </p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto animate-bounce">
          ✓
        </div>
        <h3 className="text-xl font-black text-on-surface">Delivered! 🎉</h3>
        <p className="text-sm text-on-surface-variant">
          Earnings added to your balance.
        </p>
      </div>
    );
  }

  if (!activeOrder) {
    return (
      <div className="text-center py-16 bg-surface rounded-2xl border border-outline/10 space-y-4">
        <span className="text-5xl block">🏍</span>
        <h3 className="font-bold text-on-surface">No Active Delivery</h3>
        <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
          Accept an available job to start delivering.
        </p>
        <Button
          variant="primary"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => navigate("/deliveries")}
        >
          Browse Available Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-green-600">
          In Progress
        </span>
        <h2 className="text-xl font-bold text-on-surface">
          Order #{activeOrder.order_number}
        </h2>
      </div>

      <StepIndicator step={step} />

      {/* Route card */}
      <div className="bg-surface border border-outline/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-outline/10">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">
                store
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wide">
                Pickup From
              </p>
              <p className="font-bold text-sm text-on-surface">
                {activeOrder.business?.name_en}
              </p>
              <p className="text-xs text-on-surface-variant">
                {activeOrder.business?.name_am}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-orange-500 text-[18px]">
                pin_drop
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wide">
                Deliver to
              </p>
              <p className="font-bold text-sm text-on-surface">
                {activeOrder.delivery_address}
              </p>
              {activeOrder.delivery_notes && (
                <p className="text-xs text-amber-700 mt-0.5">
                  📝 {activeOrder.delivery_notes}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-surface-container-low border-t border-outline/10 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-on-surface-variant">Payment</p>
            <p className="font-bold text-sm text-on-surface">
              {activeOrder.payment_method === "cash"
                ? `${formatETB(activeOrder.total)} (Cash)`
                : "Paid Online ✓"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant">Your Earnings</p>
            <p className="font-black font-mono text-green-600 text-lg">
              +{formatETB(activeOrder.delivery_fee)}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      {step === 0 ? (
        <Button
          variant="primary"
          className="w-full py-4 text-base font-bold bg-amber-500 hover:bg-amber-600"
          disabled={updating}
          onClick={() => void handlePickedUp()}
        >
          {updating ? "Updating..." : "📦 Mark as Picked Up"}
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full py-4 text-base font-bold bg-green-600 hover:bg-green-700 shadow-xl shadow-green-500/30"
          disabled={updating}
          onClick={() => void handleMarkDelivered()}
        >
          {updating ? "Completing..." : "✅ Mark as Delivered"}
        </Button>
      )}
    </div>
  );
}
