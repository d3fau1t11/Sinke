import { useText } from '@senik/i18n';
import { AvailableDeliveriesSection2 } from './components/AvailableDeliveriesSection2';
import { AvailableDeliveriesSection1 } from './components/AvailableDeliveriesSection1';
import { useAvailableDeliveries } from './hooks/useAvailableDeliveries';

import { EmptyState } from '@senik/ui';

import { DeliveryCard } from './DeliveryCard';

export function AvailableDeliveriesScreen() {
  const text = useText();
  const { error, isOnline, deliveries, loading, acceptingId, loadDeliveries, handleAccept } =
    useAvailableDeliveries();
  return (
    <div className="space-y-4">
      <AvailableDeliveriesSection1 {...{ loadDeliveries }} />

      {error && (
        <p role="alert" className="text-error text-sm">
          {text(error ?? '')}
        </p>
      )}
      {!isOnline && (
        <div className="flex items-start gap-2.5 p-3.5 bg-tertiary-fixed/40 rounded-2xl text-tertiary">
          <span className="material-symbols-outlined text-[19px] shrink-0 mt-0.5">wifi_off</span>
          <p className="text-body-sm leading-snug">
            {text('Go online to accept delivery jobs.') }
          </p>
        </div>
      )}

      {loading ? (
        <AvailableDeliveriesSection2 />
      ) : deliveries.length === 0 ? (
        <EmptyState
          t={(k) => k}
          isAm={false}
          title={text('No orders ready for pickup')}
          message={text("When merchants mark orders ready, they'll appear here instantly.")}
          actionLabel={text('Check again')}
          onAction={() => void loadDeliveries()}
          icon={<span className="material-symbols-outlined text-[40px]">two_wheeler</span>}
        />
      ) : (
        <div className="space-y-3">
          {deliveries.map((order) => (
            <DeliveryCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              acceptingId={acceptingId}
              disabled={!isOnline || acceptingId !== null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
