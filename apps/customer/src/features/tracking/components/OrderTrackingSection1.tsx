import { RiderLocationLink } from './RiderLocationLink';
import { useText } from '@senik/i18n';
import { Button, Card } from '@senik/ui';
import type { useOrderScreen } from '../../orders/hooks/useOrderScreen';

import { stages, labels } from '../stages';

type Props = {
  isDemo: ReturnType<typeof useOrderScreen>['isDemo'];
  advance: ReturnType<typeof useOrderScreen>['advance'];
  order: NonNullable<ReturnType<typeof useOrderScreen>['query']['data']>;
  current: number;
};
export function OrderTrackingSection1({ isDemo, advance, order, current }: Props) {
  const text = useText();
  return (
    <Card padding="lg" className="space-y-3">
      <h2 className="font-bold text-lg text-on-surface">#{order.order_number}</h2>
      {order.status === 'cancelled' ? (
        <p className="text-error">{text('This order was cancelled.')}</p>
      ) : order.status === 'pending_payment' ? (
        <p className="text-on-surface">{text('Waiting for payment')}</p>
      ) : (
        stages.map((stage, index) => (
          <p
            key={stage}
            className={index <= current ? 'font-bold text-primary' : 'text-on-surface-variant'}
          >
            {index <= current ? '✓' : '○'} {text(labels[index] ?? '')}
          </p>
        ))
      )}
      {isDemo && !['delivered', 'cancelled'].includes(order.status) && (
        <Button fullWidth loading={advance.isPending} onClick={() => advance.mutate()}>
          {text('Simulate next step')}
        </Button>
      )}
      {advance.error && (
        <p role="alert" className="text-error">
          {text(advance.error.message ?? '')}
        </p>
      )}
      {order.rider && (
        <div className="border-t pt-3">
          <p className="font-bold text-on-surface">
            {text('Your rider:')} {order.rider.full_name}
          </p>
          {!isDemo && <RiderLocationLink riderId={order.rider.id} />}
          {isDemo ? (
            <p className="text-sm text-on-surface-variant">{text('Demo rider assigned')}</p>
          ) : (
            <a className="text-primary underline" href={`tel:${order.rider.phone}`}>
              {text('Call rider')}
            </a>
          )}
        </div>
      )}
    </Card>
  );
}
