import React from "react";
import { formatETB } from "@senik/utils";
import type { TransactionRecord } from "@senik/api";

interface AdminTransactionRowProps {
  tx: TransactionRecord;
}

export function AdminTransactionRow({ tx }: AdminTransactionRowProps) {
  const methodLabel: Record<string, { label: string; bg: string }> = {
    telebirr: {
      label: "Telebirr",
      bg: "bg-blue-950 text-blue-400 border-blue-800",
    },
    cbe_birr: {
      label: "CBE Birr",
      bg: "bg-purple-950 text-purple-400 border-purple-800",
    },
    cash: {
      label: "Cash on Delivery",
      bg: "bg-amber-950 text-amber-400 border-amber-800",
    },
  };

  const typeLabel: Record<string, { label: string; badge: string }> = {
    order_payment: {
      label: "Order Payment",
      badge: "bg-emerald-950/80 text-emerald-400 border-emerald-800",
    },
    merchant_payout: {
      label: "Merchant Payout",
      badge: "bg-amber-950/80 text-amber-400 border-amber-800",
    },
    rider_payout: {
      label: "Rider Payout",
      badge: "bg-cyan-950/80 text-cyan-400 border-cyan-800",
    },
  };

  const statusBadge: Record<string, string> = {
    completed: "bg-emerald-950 text-emerald-400 border-emerald-800",
    pending: "bg-amber-950 text-amber-400 border-amber-800",
    processing: "bg-blue-950 text-blue-400 border-blue-800",
    failed: "bg-rose-950 text-rose-400 border-rose-800",
  };

  const methodInfo = methodLabel[tx.method] ?? {
    label: tx.method,
    bg: "bg-slate-800 text-slate-400 border-slate-700",
  };
  const typeInfo = typeLabel[tx.type] ?? {
    label: tx.type,
    badge: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <tr className="border-b border-slate-800/60 text-xs text-slate-300 hover:bg-slate-800/40 transition-colors">
      <td className="py-3 px-4">
        <span className="font-mono font-bold text-indigo-400 block">
          {tx.reference}
        </span>
        {tx.orderNumber && (
          <span className="text-[10px] text-slate-500 font-mono">
            #{tx.orderNumber}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${typeInfo.badge}`}
        >
          {typeInfo.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <p className="font-semibold text-white">{tx.partyName}</p>
        <p className="text-[10px] text-slate-500">{tx.partyRole}</p>
      </td>
      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
        {formatETB(tx.amount)}
      </td>
      <td className="py-3 px-4 font-mono text-slate-400">
        {tx.fee > 0 ? formatETB(tx.fee) : "—"}
      </td>
      <td className="py-3 px-4 font-mono font-semibold text-white">
        {formatETB(tx.net)}
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${methodInfo.bg}`}
        >
          {methodInfo.label}
        </span>
      </td>
      <td className="py-3 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusBadge[tx.status] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
        >
          {tx.status}
        </span>
      </td>
      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
        {new Date(tx.createdAt).toLocaleDateString()}{" "}
        {new Date(tx.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}
