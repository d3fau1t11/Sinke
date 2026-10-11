import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import { Button } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { OrderSummary } from "@senik/types";
import { useRiderAuthStore } from "../auth/store/riderAuthStore";
import { useRiderWalletStore } from "./store/riderWalletStore";
import { RiderWithdrawalModal } from "./RiderWithdrawalModal";

export function RiderEarningsScreen() {
  const { riderId } = useRiderAuthStore();
  const { balance, lifetimeEarnings, withdrawals } = useRiderWalletStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

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
  const today = new Date().toDateString();
  const todayEarnings = delivered
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((acc, o) => acc + (o.delivery_fee || 0), 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-on-surface">My Earnings</h2>
        <p className="text-xs text-on-surface-variant">
          Balance & delivery payout history
        </p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-5 shadow-xl text-white">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute bottom-2 left-32 w-16 h-16 rounded-full bg-white/5" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-green-200">
          Available Balance
        </p>
        <p className="text-4xl font-black font-mono mt-1">
          {formatETB(balance)}
        </p>
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/20 text-xs">
          <div>
            <p className="text-green-300">Lifetime Earned</p>
            <p className="font-bold">{formatETB(lifetimeEarnings)}</p>
          </div>
          <div>
            <p className="text-green-300">Today</p>
            <p className="font-bold">{formatETB(todayEarnings)}</p>
          </div>
          <div>
            <p className="text-green-300">Trips Done</p>
            <p className="font-bold">{delivered.length}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 bg-white/20 hover:bg-white/30 border-white/30 text-white font-bold w-full"
          onClick={() => setShowWithdrawal(true)}
        >
          💸 Withdraw Earnings
        </Button>
      </div>

      {/* Recent Deliveries */}
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-2">
          Recent Deliveries
        </h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-7 h-7 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-on-surface-variant">
              Loading history...
            </p>
          </div>
        ) : delivered.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-2xl border border-outline/10">
            <span className="text-3xl block mb-2">🚴</span>
            <p className="text-sm font-semibold text-on-surface">
              No completed deliveries yet
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Complete your first delivery to earn!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {delivered.slice(0, 15).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between bg-surface border border-outline/10 rounded-xl px-3 py-2.5"
              >
                <div>
                  <p className="text-xs font-mono font-bold text-on-surface">
                    #{order.order_number}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate max-w-[180px]">
                    {order.business?.name_en} ➔ {order.delivery_address}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-mono font-bold text-sm text-green-600">
                  +{formatETB(order.delivery_fee)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-2">
            Withdrawal Requests
          </h3>
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between bg-surface border border-outline/10 rounded-xl px-3 py-2.5"
              >
                <div>
                  <p className="text-xs font-bold text-on-surface">
                    {w.method === "cbe" ? "🏦 CBE" : "📱 telebirr"} —{" "}
                    {w.accountName}
                  </p>
                  <p className="text-[10px] font-mono text-on-surface-variant">
                    {w.referenceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-on-surface">
                    -{formatETB(w.amount)}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${w.status === "completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RiderWithdrawalModal
        riderId={riderId ?? ""}
        isOpen={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
        onSuccess={() => setShowWithdrawal(false)}
      />
    </div>
  );
}
