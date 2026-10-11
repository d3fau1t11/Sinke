import React, { useState, useEffect } from "react";
import { Card, Button } from "@senik/ui";
import { formatETB } from "@senik/utils";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { useMerchantWalletStore } from "./store/merchantWalletStore";
import { WithdrawalModal } from "./WithdrawalModal";

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            Finances & Payouts
          </h2>
          <p className="text-xs text-on-surface-variant">
            Live balance and withdrawal requests for {businessName}
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={availableBalance <= 0}
        >
          Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card
          variant="outlined"
          padding="md"
          className="border-primary/20 bg-primary/5"
        >
          <p className="text-xs font-semibold text-primary">
            AVAILABLE BALANCE
          </p>
          <p className="text-2xl font-black text-on-surface mt-1 font-mono">
            {formatETB(availableBalance)}
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Ready to withdraw to CBE / telebirr
          </p>
        </Card>

        <Card
          variant="outlined"
          padding="md"
          className="border-secondary/20 bg-secondary/5"
        >
          <p className="text-xs font-semibold text-secondary">LIFETIME SALES</p>
          <p className="text-2xl font-black text-on-surface mt-1 font-mono">
            {formatETB(grossEarnings)}
          </p>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {delivered.length} completed order(s)
          </p>
        </Card>

        <Card
          variant="outlined"
          padding="md"
          className="border-amber-200 bg-amber-50/50"
        >
          <p className="text-xs font-semibold text-amber-700">
            PENDING PAYOUTS
          </p>
          <p className="text-2xl font-black text-amber-800 mt-1 font-mono">
            {formatETB(pendingAmount)}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">
            Under verification
          </p>
        </Card>

        <Card
          variant="outlined"
          padding="md"
          className="border-gray-200 bg-gray-50/50"
        >
          <p className="text-xs font-semibold text-gray-700">TOTAL WITHDRAWN</p>
          <p className="text-2xl font-black text-gray-800 mt-1 font-mono">
            {formatETB(totalWithdrawn)}
          </p>
          <p className="text-[11px] text-gray-600 mt-0.5">
            {bizWithdrawals.length} withdrawal(s)
          </p>
        </Card>
      </div>

      <Card variant="outlined" padding="md" className="space-y-4">
        <h3 className="font-bold text-sm text-on-surface">
          Recent Payout Requests
        </h3>
        {loading ? (
          <p className="text-xs text-on-surface-variant py-4 text-center">
            Loading transactions...
          </p>
        ) : bizWithdrawals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-on-surface">
              No withdrawal requests yet
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Earnings from delivered orders will appear in your balance.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bizWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-xl border border-outline/10 bg-surface flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      {w.method === "cbe" ? "🏦 CBE" : "📱 telebirr"}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      ({w.referenceNumber})
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {w.accountName} • {w.accountNumber}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {new Date(w.requestedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-primary">
                    {formatETB(w.amount)}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                    {w.status}
                  </span>
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
