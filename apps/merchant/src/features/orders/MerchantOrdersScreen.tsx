import { useText } from '@senik/i18n';
import { MerchantOrderList } from './components/MerchantOrderList';
import { MerchantOrdersSection1 } from './components/MerchantOrdersSection1';
import { useMerchantOrders } from './hooks/useMerchantOrders';

import { Button } from '@senik/ui';

export function MerchantOrdersScreen() {
  const text = useText();
  const {
    error,
    loading,
    activeTab,
    setActiveTab,
    updatingId,
    loadOrders,
    handleUpdateStatus,
    countFor,
    filteredOrders,
    TABS,
    TAB_LABELS,
  } = useMerchantOrders();
  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          {text('Manage Orders')}
        </h2>
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-level-1 flex items-center justify-center text-primary active:scale-95 transition-all"
          aria-label={text('Refresh orders')}
        >
          <span className="material-symbols-outlined text-[19px]">refresh</span>
        </button>
      </div>

      {/* Pipeline filter chips with live counts */}
      <MerchantOrdersSection1 {...{ activeTab, setActiveTab, countFor, TABS, TAB_LABELS }} />

      <MerchantOrderList {...{ loading, filteredOrders, handleUpdateStatus, updatingId }} />

      {!loading && filteredOrders.length === 0 && activeTab === 'placed' && (
        <div className="text-center">
          <Button size="sm" variant="secondary" onClick={() => setActiveTab('all')}>
            {text('View all orders instead')}
          </Button>
        </div>
      )}
    </div>
  );
}
