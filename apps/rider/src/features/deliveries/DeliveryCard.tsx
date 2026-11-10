import { useText } from '@senik/i18n';
import { DeliveryCardSection1 } from './components/DeliveryCardSection1';

import { Button, StatusBadge } from '@senik/ui';
import { formatETB } from '@senik/utils';
import type { OrderSummary } from '@senik/types';

interface DeliveryCardProps {
  order: OrderSummary;
  onAccept: (orderId: string) => void;
  acceptingId: string | null;
  disabled: boolean;
}

export function DeliveryCard({ order, onAccept, acceptingId, disabled }: DeliveryCardProps) {
  const text = useText();
  const isAccepting = acceptingId === order.id;

  return (
    <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl shadow-level-1 hover:shadow-level-2 transition-all">
      {/* Delivery fee badge — money is always green */}
      <div className="absolute top-3 right-3 bg-secondary text-white text-label-sm font-black px-2.5 py-1 rounded-full shadow-level-1 tabular-nums">
        +{formatETB(order.delivery_fee)}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 pr-20">
          <span className="font-mono font-bold text-body-sm text-on-surface">
            #{order.order_number}
          </span>
          <StatusBadge tone="progress" dot>
            {text('Ready for Pickup')}
          </StatusBadge>
        </div>

        <DeliveryCardSection1 {...{ order }} />

        <div className="pt-2.5 border-t border-outline-variant/60 flex items-center justify-between gap-3">
          <span className="text-label-sm text-on-surface-variant">
            {text('Payment:')}{' '}
            <span className="font-bold text-on-surface capitalize">{order.payment_method}</span>{' '}
            <span className="tabular-nums">({formatETB(order.total)})</span>
          </span>
          <Button
            size="md"
            variant="primary"
            className="shrink-0"
            disabled={disabled || isAccepting}
            onClick={() => onAccept(order.id)}
          >
            <span className="material-symbols-outlined text-[17px]">check</span>
            {isAccepting ? text('Accepting...') : text('Accept Job')}
          </Button>
        </div>
      </div>
    </div>
  );
}
