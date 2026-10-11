import React, { useState, useEffect } from "react";
import { Card, Button, StatusBadge, Skeleton, EmptyState } from "@senik/ui";
import { formatETB } from "@senik/utils";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { useMerchantWalletStore } from "./store/merchantWalletStore";
import { WithdrawalModal } from "./WithdrawalModal";

interface StatTileProps {
  label: string;
  value: string;
  helper: string;
  emphasis?: boolean;
  pending?: boolean;
}

function StatTile({ label, value, helper, emphasis = false, pending = false }: StatTileProps) {
  return (
    <Card
      padding="md"
      className={emphasis ? "bg-secondary/5" : pending ? "bg-tertiary-fixed/20" : undefined}
    >
      <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
        {label}
      </p>
      <p
        className={`font-display font-black text-title-lg mt-1 tabular-nums ${
          pending ? "text-tertiary" : "text-secondary"
        }`}
      >
        {value}
      </p>
      <p className="text-label-sm text-on-surface-variant/80 mt-0.5">{helper}</p>
    </Card>
  );
}

export function MerchantFinancesScreen() {
  const { merchantId, businessName } = useMerchantAuthStore();
  const { withdrawals } = useMerchantWalletStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    if (!merchantId) return;
    try {
      const data = await ordersApi.getByBusiness(merchantId);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders for finance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const delivered = orders.filter((o) => o.status === "delivered");
  const grossEarnings = delivered.reduce((sum, o) => sum + o.subtotal, 0);

  const bizWithdrawals = withdrawals.filter((w) => w.businessId === merchantId);
  const totalWithdrawn = bizWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = Math.max(0, grossEarnings - totalWithdrawn);
  const pendingAmount = bizWithdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center gap-3">
        <div>
          <h2 className="font-display font-bold text-title-lg text-on-surface">
            Finances &amp; Payouts
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            Live balance for {businessName}
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          className="shrink-0"
          onClick={() => setIsModalOpen(true)}
          disabled={availableBalance <= 0}
        >
          Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          label="Available Balance"
          value={formatETB(availableBalance)}
          helper="Ready to withdraw to CBE / telebirr"
          emphasis
        />
        <StatTile
          label="Lifetime Sales"
          value={formatETB(grossEarnings)}
          helper={`${delivered.length} completed order(s)`}
        />
        <StatTile
          label="Pending Payouts"
          value={formatETB(pendingAmount)}
          helper="Under verification"
          pending
        />
        <StatTile
          label="Total Withdrawn"
          value={formatETB(totalWithdrawn)}
          helper={`${bizWithdrawals.length} withdrawal(s)`}
        />
      </div>

      <Card padding="md" className="space-y-4">
        <h3 className="font-display font-bold text-title-md text-on-surface">
          Recent Payout Requests
        </h3>
        {loading ? (
          <div className="space-y-2">
            <Skeleton variant="rectangular" height="64px" />
            <Skeleton variant="rectangular" height="64px" />
          </div>
        ) : bizWithdrawals.length === 0 ? (
          <EmptyState
            t={(k) => k}
            isAm={false}
            title="No withdrawal requests yet"
            message="Earnings from delivered orders will appear in your balance."
            icon={
              <span className="material-symbols-outlined text-[40px]">
                account_balance_wallet
              </span>
            }
          />
        ) : (
          <div className="space-y-2">
            {bizWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-surface-container-low flex justify-between items-center gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-full bg-surface-container-lowest shadow-level-1 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      {w.method === "cbe" ? "account_balance" : "smartphone"}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-body-sm text-on-surface">
                        {w.method === "cbe" ? "CBE" : "telebirr"}
                      </span>
                      <span className="text-label-sm text-on-surface-variant font-mono">
                        ({w.referenceNumber})
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {w.accountName} · {w.accountNumber}
                    </p>
                    <p className="text-micro text-on-surface-variant/70">
                      {new Date(w.requestedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-body-sm text-secondary tabular-nums">
                    {formatETB(w.amount)}
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
        )}
      </Card>

      <WithdrawalModal
        businessId={merchantId || ""}
        availableBalance={availableBalance}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => void loadData()}
      />
    </div>
  );
}
