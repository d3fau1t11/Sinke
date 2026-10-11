import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Skeleton } from "@senik/ui";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";
import { useMerchantWalletStore } from "../finances/store/merchantWalletStore";
import { formatETB } from "@senik/utils";
import { PipelineTile } from "./PipelineTile";

export function MerchantDashboardScreen() {
  const navigate = useNavigate();
  const { merchantId, businessName } = useMerchantAuthStore();
  const { withdrawals } = useMerchantWalletStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!merchantId) return;
      try {
        const data = await ordersApi.getByBusiness(merchantId);
        setOrders(data);
      } catch (err) {
        console.error("Failed to load merchant orders", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [merchantId]);

  const incoming = orders.filter((o) => o.status === "placed");
  const preparing = orders.filter(
    (o) => o.status === "preparing" || o.status === "accepted",
  );
  const ready = orders.filter((o) => o.status === "ready");
  const delivered = orders.filter((o) => o.status === "delivered");
  const grossEarnings = delivered.reduce((sum, o) => sum + o.subtotal, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.businessId === merchantId)
    .reduce((s, w) => s + w.amount, 0);
  const availableBalance = Math.max(0, grossEarnings - totalWithdrawn);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          Store Overview
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Live operations for {businessName}
        </p>
      </div>

      {/* Available balance — money is always green */}
      <Card padding="md" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              account_balance_wallet
            </span>
          </span>
          <div>
            <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
              Available Balance
            </p>
            <p className="font-display font-black text-display text-secondary tabular-nums leading-tight">
              {formatETB(availableBalance)}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate("/finances")}
        >
          Payout
        </Button>
      </Card>

      {/* Order pipeline — tap a stage to open the filtered queue */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PipelineTile
          label="Incoming"
          count={incoming.length}
          helper="Needs action"
          icon="notifications_active"
          tone="primary"
          onClick={() => navigate("/orders?tab=placed")}
        />
        <PipelineTile
          label="Preparing"
          count={preparing.length}
          helper="In kitchen"
          icon="skillet"
          tone="progress"
          onClick={() => navigate("/orders?tab=preparing")}
        />
        <PipelineTile
          label="Ready"
          count={ready.length}
          helper="Awaiting rider"
          icon="inventory_2"
          tone="success"
          onClick={() => navigate("/orders?tab=ready")}
        />
        <PipelineTile
          label="Completed"
          count={delivered.length}
          helper="Balance credited"
          icon="check_circle"
          tone="neutral"
          onClick={() => navigate("/orders?tab=completed")}
        />
      </div>

      {/* Live order queue */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-title-md text-on-surface">
            Live Order Queue
          </h3>
          <Button size="sm" variant="ghost" onClick={() => navigate("/orders")}>
            View All
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2 py-1">
            <Skeleton variant="rectangular" height="56px" />
            <Skeleton variant="rectangular" height="56px" />
          </div>
        ) : incoming.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-primary/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[19px]">
                  notifications_active
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-bold text-title-sm text-on-surface">
                  {incoming.length} new incoming order
                  {incoming.length > 1 ? "s" : ""}!
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Review and accept to begin preparation.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate("/orders?tab=placed")}
            >
              Open
            </Button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center text-center gap-1.5">
            <span className="material-symbols-outlined text-[28px] text-secondary">
              check_circle
            </span>
            <p className="text-body-sm text-on-surface-variant">
              All caught up — no pending orders right now.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
