import React from "react";
import { Card } from "@senik/ui";
import { formatETB } from "@senik/utils";
import type { TransactionRecord } from "@senik/api";

interface AdminTransactionStatsProps {
  transactions: TransactionRecord[];
}

export function AdminTransactionStats({
  transactions,
}: AdminTransactionStatsProps) {
  const totalVolume = transactions
    .filter((t) => t.type === "order_payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = transactions
    .filter((t) => t.type === "order_payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.fee, 0);

  const totalPayouts = transactions
    .filter((t) => t.type !== "order_payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter(
    (t) => t.status === "pending",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        variant="outlined"
        padding="md"
        className="bg-slate-900 border-slate-800"
      >
        <p className="text-xs font-semibold text-slate-400">
          TOTAL SETTLED VOLUME
        </p>
        <p className="text-2xl font-black text-emerald-400 mt-1">
          {formatETB(totalVolume)}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">Completed order gross</p>
      </Card>

      <Card
        variant="outlined"
        padding="md"
        className="bg-slate-900 border-slate-800"
      >
        <p className="text-xs font-semibold text-slate-400">PLATFORM REVENUE</p>
        <p className="text-2xl font-black text-indigo-400 mt-1">
          {formatETB(totalFees)}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">5% commission cut</p>
      </Card>

      <Card
        variant="outlined"
        padding="md"
        className="bg-slate-900 border-slate-800"
      >
        <p className="text-xs font-semibold text-slate-400">PARTNER PAYOUTS</p>
        <p className="text-2xl font-black text-amber-400 mt-1">
          {formatETB(totalPayouts)}
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Merchant & rider withdrawals
        </p>
      </Card>

      <Card
        variant="outlined"
        padding="md"
        className="bg-slate-900 border-slate-800"
      >
        <p className="text-xs font-semibold text-slate-400">
          PENDING SETTLEMENTS
        </p>
        <p className="text-2xl font-black text-blue-400 mt-1">{pendingCount}</p>
        <p className="text-[11px] text-slate-500 mt-1">Awaiting confirmation</p>
      </Card>
    </div>
  );
}
