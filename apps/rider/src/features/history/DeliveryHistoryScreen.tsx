import { useText } from '@senik/i18n';
import { DeliveryHistorySection1 } from './components/DeliveryHistorySection1';
import { useDeliveryHistory } from './hooks/useDeliveryHistory';

import { Card, Skeleton, EmptyState } from '@senik/ui';
import { formatETB } from '@senik/utils';

export function DeliveryHistoryScreen() {
  const text = useText();
  const { loading, delivered, totalEarned } = useDeliveryHistory();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          {text('Delivery History')}
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          {text('Your completed trips and earnings')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card padding="md">
          <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
            {text('Completed Trips')}
          </p>
          <p className="font-display font-black text-title-xl text-on-surface mt-1 tabular-nums">
            {delivered.length}
          </p>
        </Card>
        {/* Money — green */}
        <Card padding="md" className="bg-secondary/5">
          <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
            {text('Total Earnings')}
          </p>
          <p className="font-display font-black text-title-xl text-secondary mt-1 tabular-nums">
            {formatETB(totalEarned)}
          </p>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton variant="rectangular" height="64px" />
          <Skeleton variant="rectangular" height="64px" />
          <Skeleton variant="rectangular" height="64px" />
        </div>
      ) : delivered.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title={text('No completed deliveries yet')}
          message={text('Deliveries you finish will be recorded here.')}
          icon={<span className="material-symbols-outlined text-[40px]">two_wheeler</span>}
        />
      ) : (
        <DeliveryHistorySection1 {...{ delivered }} />
      )}
    </div>
  );
}
