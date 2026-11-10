import { useText } from "@senik/i18n";
import { AdminTransactionStats } from "./AdminTransactionStats";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import { useAdminTransactions } from "./hooks/useAdminTransactions";

export function AdminTransactionsScreen() {
  const text = useText();
  const model = useAdminTransactions();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {text("Financial Transactions")}
          </h1>
          <p className="text-xs text-slate-400">
            {text("Review order payments and their payment status.")}
          </p>
        </div>
        <button
          type="button"
          onClick={model.refresh}
          className="text-xs text-indigo-400 font-semibold hover:underline"
        >
          {text("Refresh Feed")}
        </button>
      </div>
      {model.error && (
        <p role="alert" className="text-red-400">
          {text(model.error ?? "")}
        </p>
      )}
      <AdminTransactionStats transactions={model.transactions} />
      <TransactionFilters filters={model.filters} onFilter={model.onFilter} />
      <TransactionTable filtered={model.filtered} loading={model.loading} />
    </div>
  );
}
