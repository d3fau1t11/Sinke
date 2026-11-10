import { useText } from '@senik/i18n';
import { AdminOrdersSection1 } from './components/AdminOrdersSection1';
import { useAdminOrders } from './hooks/useAdminOrders';

export function AdminOrdersScreen() {
  const text = useText();
  const {
    error,
    loading,
    filter,
    setFilter,
    updatingId,
    loadOrders,
    handleUpdateStatus,
    filtered,
  } = useAdminOrders();
  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{text('Live Orders Oversight')}</h1>
          <p className="text-xs text-slate-400">
            {text('Control and manage order lifecycle across all areas')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="text-xs text-primary font-semibold hover:underline"
        >
          {text('Refresh Feed')}
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'placed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'].map(
          (tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ),
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <AdminOrdersSection1 {...{ loading, updatingId, handleUpdateStatus, filtered }} />
      </div>
    </div>
  );
}
