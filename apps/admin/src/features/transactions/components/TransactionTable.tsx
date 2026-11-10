import { useText } from '@senik/i18n';
import { AdminTransactionRow } from '../AdminTransactionRow';
import type { useAdminTransactions } from '../hooks/useAdminTransactions';
type Props = Pick<ReturnType<typeof useAdminTransactions>, 'filtered' | 'loading'>;
export function TransactionTable({ filtered, loading }: Props) {
  const text = useText();
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {[
                'Reference',
                'Type',
                'Party',
                'Amount',
                'Platform Fee',
                'Net',
                'Method',
                'Status',
                'Date',
              ].map((label) => (
                <th key={label} className="py-3 px-4">
                  {text(label ?? '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading || !filtered.length ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-xs text-slate-400">
                  {loading
                    ? text('Loading financial transactions...')
                    : text('No transactions match current filters.')}
                </td>
              </tr>
            ) : (
              filtered.map((transaction) => (
                <AdminTransactionRow key={transaction.id} tx={transaction} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
