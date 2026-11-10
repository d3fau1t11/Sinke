import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import type { useDeliveryHistory } from '../hooks/useDeliveryHistory';
import { Card, StatusBadge } from '@senik/ui';
import { formatETB } from '@senik/utils';

type Props = { delivered: ReturnType<typeof useDeliveryHistory>['delivered'] };
export function DeliveryHistorySection1({ delivered }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <div className="space-y-2">
      {delivered.map((order) => (
        <Card key={order.id} padding="sm" className="space-y-1">
          <div className="flex justify-between items-center gap-2">
            <span className="font-mono font-bold text-body-sm text-on-surface">
              #{order.order_number}
            </span>
            {/* Money — green */}
            <span className="font-mono font-bold text-body-sm text-secondary tabular-nums">
              +{formatETB(order.delivery_fee)}
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant truncate flex items-center gap-1">
            <span className="truncate">{localizedName(order.business)}</span>
            <span className="material-symbols-outlined text-[13px] shrink-0">arrow_forward</span>
            <span className="truncate">{order.delivery_address}</span>
          </p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-label-sm text-on-surface-variant/70 tabular-nums">
              {new Date(order.created_at).toLocaleDateString()}{' '}
              {new Date(order.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <StatusBadge tone="success">{text('Delivered')}</StatusBadge>
          </div>
        </Card>
      ))}
    </div>
  );
}
