import React, { useState, useEffect } from "react";
import { transactionsApi, type TransactionRecord } from "@senik/api";
import { AdminTransactionStats } from "./AdminTransactionStats";
import { AdminTransactionRow } from "./AdminTransactionRow";

export function AdminTransactionsScreen() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const data = await transactionsApi.getAll();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  const filtered = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (methodFilter !== "all" && t.method !== methodFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const match =
        t.reference.toLowerCase().includes(term) ||
        t.partyName.toLowerCase().includes(term) ||
        (t.orderNumber && t.orderNumber.toLowerCase().includes(term));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Financial Transactions
          </h1>
          <p className="text-xs text-slate-400">
            Track customer payments, merchant withdrawals, and rider payouts
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadData()}
          className="text-xs text-indigo-400 font-semibold hover:underline"
        >
          Refresh Feed
        </button>
      </div>

      <AdminTransactionStats transactions={transactions} />

      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex gap-2 flex-wrap">
          {(
            ["all", "order_payment", "merchant_payout", "rider_payout"] as const
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                typeFilter === type
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none"
          >
            <option value="all">All Methods</option>
            <option value="telebirr">Telebirr</option>
            <option value="cbe_birr">CBE Birr</option>
            <option value="cash">Cash</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <input
            type="text"
            placeholder="Search ref or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 outline-none placeholder:text-slate-500 w-44"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Party</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Platform Fee</th>
                <th className="py-3 px-4">Net</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-16 text-center text-xs text-slate-400"
                  >
                    Loading financial transactions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-16 text-center text-xs text-slate-400"
                  >
                    No transactions match current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <AdminTransactionRow key={tx.id} tx={tx} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
