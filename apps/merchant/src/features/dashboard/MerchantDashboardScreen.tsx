import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "@senik/ui";
import { ordersApi } from "@senik/api";
import type { OrderSummary } from "@senik/types";
import { useMerchantAuthStore } from "../auth/store/merchantAuthStore";

export function MerchantDashboardScreen() {
  const navigate = useNavigate();
  const { merchantId, businessName } = useMerchantAuthStore();
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Store Overview</h2>
        <p className="text-sm text-on-surface-variant">
          Live operations for {businessName}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card
          variant="outlined"
          padding="md"
          className="border-amber-200 bg-amber-50/50"
        >
          <p className="text-xs font-semibold text-amber-700">INCOMING</p>
          <p className="text-2xl font-black text-amber-800 mt-1">
            {incoming.length}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">Needs action</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="border-blue-200 bg-blue-50/50"
        >
          <p className="text-xs font-semibold text-blue-700">PREPARING</p>
          <p className="text-2xl font-black text-blue-800 mt-1">
            {preparing.length}
          </p>
          <p className="text-[11px] text-blue-600 mt-0.5">In kitchen</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="border-emerald-200 bg-emerald-50/50"
        >
          <p className="text-xs font-semibold text-emerald-700">READY</p>
          <p className="text-2xl font-black text-emerald-800 mt-1">
            {ready.length}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Awaiting rider</p>
        </Card>
        <Card
          variant="outlined"
          padding="md"
          className="border-gray-200 bg-gray-50/50"
        >
          <p className="text-xs font-semibold text-gray-700">COMPLETED</p>
          <p className="text-2xl font-black text-gray-800 mt-1">
            {delivered.length}
          </p>
          <p className="text-[11px] text-gray-600 mt-0.5">Delivered</p>
        </Card>
      </div>

      <Card variant="outlined" padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-on-surface">Live Order Queue</h3>
          <Button size="sm" variant="ghost" onClick={() => navigate("/orders")}>
            View All Orders
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-on-surface-variant py-4 text-center">
            Loading orders...
          </p>
        ) : incoming.length > 0 ? (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm text-amber-900">
                You have {incoming.length} new incoming order(s)!
              </p>
              <p className="text-xs text-amber-700">
                Review and accept to begin preparation.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate("/orders")}
            >
              Open Queue
            </Button>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant py-6 text-center">
            No pending orders waiting right now.
          </p>
        )}
      </Card>
    </div>
  );
}
