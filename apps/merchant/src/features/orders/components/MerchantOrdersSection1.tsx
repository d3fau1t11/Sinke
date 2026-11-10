import { useText } from '@senik/i18n';
import type { useMerchantOrders } from '../hooks/useMerchantOrders';

type Props = {
  activeTab: ReturnType<typeof useMerchantOrders>['activeTab'];
  setActiveTab: ReturnType<typeof useMerchantOrders>['setActiveTab'];
  countFor: ReturnType<typeof useMerchantOrders>['countFor'];
  TABS: ReturnType<typeof useMerchantOrders>['TABS'];
  TAB_LABELS: ReturnType<typeof useMerchantOrders>['TAB_LABELS'];
};
export function MerchantOrdersSection1({
  activeTab,
  setActiveTab,
  countFor,
  TABS,
  TAB_LABELS,
}: Props) {
  const text = useText();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          aria-pressed={activeTab === tab}
          className={`px-3.5 py-1.5 rounded-full text-body-sm font-semibold whitespace-nowrap transition-all tabular-nums ${
            activeTab === tab
              ? 'bg-primary text-on-primary shadow-[0_6px_16px_-8px_rgba(167,52,0,0.55)]'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          {text(TAB_LABELS[tab].en)} ({countFor(tab)})
        </button>
      ))}
    </div>
  );
}
