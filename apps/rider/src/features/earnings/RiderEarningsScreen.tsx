import React, { useState, useEffect } from "react";
import { ordersApi } from "@senik/api";
import { Button, StatusBadge, Skeleton, EmptyState } from "@senik/ui";
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
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          My Earnings
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Balance &amp; delivery payout history
        </p>
      </div>

      {/* Money hero — the one place green takes over */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-[#14521c] p-5 shadow-level-3 text-white">
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <p className="text-micro font-bold uppercase tracking-[0.08em] text-white/80">
          Available Balance
        </p>
        <p className="font-display font-black text-[36px] leading-tight mt-1 tabular-nums">
          {formatETB(balance)}
        </p>
        <div className="flex gap-5 mt-3 pt-3 border-t border-white/20 text-body-sm">
          <div>
            <p className="text-white/70">Lifetime Earned</p>
            <p className="font-bold tabular-nums">{formatETB(lifetimeEarnings)}</p>
          </div>
          <div>
            <p className="text-white/70">Today</p>
            <p className="font-bold tabular-nums">{formatETB(todayEarnings)}</p>
          </div>
          <div>
            <p className="text-white/70">Trips Done</p>
            <p className="font-bold tabular-nums">{delivered.length}</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          className="mt-4 w-full !bg-white !text-secondary hover:!bg-white/90 shadow-none"
          onClick={() => setShowWithdrawal(true)}
        >
          <span className="material-symbols-outlined text-[18px]">
            account_balance_wallet
          </span>
          Withdraw Earnings
        </Button>
      </div>

      {/* Recent Deliveries */}
      <div>
        <h3 className="font-display font-bold text-title-md text-on-surface mb-2.5">
          Recent Deliveries
        </h3>
        {loading ? (
          <div className="space-y-2">
            <Skeleton variant="rectangular" height="64px" />
            <Skeleton variant="rectangular" height="64px" />
          </div>
        ) : delivered.length === 0 ? (
          <EmptyState
            t={(k) => k}
            isAm={false}
            title="No completed deliveries yet"
            message="Complete your first delivery to earn!"
            icon={
              <span className="material-symbols-outlined text-[40px]">
                two_wheeler
              </span>
            }
          />
        ) : (
          <div className="space-y-2">
            {delivered.slice(0, 15).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 bg-surface-container-lowest rounded-2xl shadow-level-1 px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-body-sm font-mono font-bold text-on-surface">
                    #{order.order_number}
                  </p>
                  <p className="text-label-sm text-on-surface-variant truncate max-w-[200px] flex items-center gap-1">
                    <span className="truncate">{order.business?.name_en}</span>
                    <span className="material-symbols-outlined text-[13px] shrink-0">
                      arrow_forward
                    </span>
                    <span className="truncate">{order.delivery_address}</span>
                  </p>
                  <p className="text-micro text-on-surface-variant/70">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                {/* Money — green */}
                <span className="font-mono font-bold text-body-sm text-secondary tabular-nums shrink-0">
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
          <h3 className="font-display font-bold text-title-md text-on-surface mb-2.5">
            Withdrawal Requests
          </h3>
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between gap-3 bg-surface-container-lowest rounded-2xl shadow-level-1 px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-surface-container-low text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      {w.method === "cbe" ? "account_balance" : "smartphone"}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="text-body-sm font-bold text-on-surface truncate">
                      {w.method === "cbe" ? "CBE" : "telebirr"} · {w.accountName}
                    </p>
                    <p className="text-micro font-mono text-on-surface-variant">
                      {w.referenceNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-body-sm text-on-surface tabular-nums">
                    -{formatETB(w.amount)}
                  </p>
                  <StatusBadge
                    tone={w.status === "completed" ? "success" : "progress"}
                    className="mt-1"
                  >
                    {w.status}
                  </StatusBadge>
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
