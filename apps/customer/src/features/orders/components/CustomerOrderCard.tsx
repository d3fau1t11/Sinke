import { Card } from '@senik/ui';
import { useLocalizedName, useText } from '@senik/i18n';
import { formatETB } from '@senik/utils';
import type { OrderSummary } from '@senik/types';

export function CustomerOrderCard({ order, onSelect }: {
  order: OrderSummary; onSelect: (id: string) => void;
}) {
  const name = useLocalizedName();
  const text = useText();
  return <Card variant="outlined" padding="md" hoverable onClick={() => onSelect(order.id)}>
    <div className="flex items-center gap-3">
      <img src={order.business?.avatar_image || '/senik-logo.png'} alt={name(order.business)}
        className="w-14 h-14 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-on-surface">{name(order.business)}</h3>
        <p className="text-sm text-on-surface-variant truncate">
          {order.order_items.map((item) => name(item.product)).join(', ')}
        </p>
        <p className="text-sm">#{order.order_number} · {formatETB(order.total)}</p>
      </div>
      <span className="text-sm font-bold text-primary">{text(order.status)}</span>
    </div>
  </Card>;
}
