import { useText } from '@senik/i18n';
import type { useAdminTransactions } from '../hooks/useAdminTransactions';
type Props = Pick<ReturnType<typeof useAdminTransactions>, 'filters' | 'onFilter'>;
export function TransactionFilters({ filters, onFilter }: Props) {
  const text = useText();
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
      <div className="flex gap-2 flex-wrap">
        {['all', 'order_payment', 'merchant_payout', 'rider_payout'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onFilter('type', type)}
            aria-pressed={filters.type === type}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${filters.type === type ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {text(type)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          aria-label={text('Payment method')}
          value={filters.method}
          onChange={(event) => onFilter('method', event.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5"
        >
          <option value="all">{text('All Methods')}</option>
          <option value="telebirr">{text('Telebirr')}</option>
          <option value="cbe_birr">{text('CBE Birr')}</option>
          <option value="cash">{text('Cash')}</option>
        </select>
        <select
          aria-label={text('Payment status')}
          value={filters.status}
          onChange={(event) => onFilter('status', event.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5"
        >
          <option value="all">{text('All Statuses')}</option>
          <option value="completed">{text('Completed')}</option>
          <option value="pending">{text('Pending')}</option>
          <option value="failed">{text('Failed')}</option>
        </select>
        <input
          aria-label={text('Search transactions')}
          placeholder={text('Search ref or user...')}
          value={filters.search}
          onChange={(event) => onFilter('search', event.target.value)}
          className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 w-44"
        />
      </div>
    </div>
  );
}
