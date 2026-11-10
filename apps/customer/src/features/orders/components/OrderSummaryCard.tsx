import { useText } from '@senik/i18n';
import type { OrderDetail } from '@senik/types';
import { Card } from '@senik/ui';
import { formatETB } from '@senik/utils';

interface OrderSummaryCardProps {
  order: OrderDetail;
  isAm: boolean;
}

export function OrderSummaryCard({ order, isAm }: OrderSummaryCardProps) {
  const text = useText();
  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <h2 className="font-bold text-lg text-on-surface">
          {isAm ? order.business?.name_am : order.business?.name_en}
        </h2>
        <p className="text-on-surface-variant">
          #{order.order_number} · {order.status.replace('_', ' ')}
        </p>
      </div>
      {order.order_items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm text-on-surface">
          <span>
            {item.quantity} × {isAm ? item.product?.name_am : item.product?.name_en}
          </span>
          <span>{formatETB(item.price * item.quantity)}</span>
        </div>
      ))}
      <div className="space-y-2 border-t pt-3">
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{text('Subtotal')}</span>
          <span>{formatETB(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{text('Delivery Fee')}</span>
          <span>{formatETB(order.delivery_fee)}</span>
        </div>
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{text('Service Fee')}</span>
          <span>{formatETB(order.service_fee)}</span>
        </div>
        <div className="flex justify-between font-bold text-primary">
          <span>{text('Total')}</span>
          <span>{formatETB(order.total)}</span>
        </div>
      </div>
      <p className="text-sm text-on-surface-variant">
        {text('Deliver to:')} {order.delivery_address}
      </p>
      {order.delivery_notes && (
        <p className="text-sm text-on-surface-variant">{order.delivery_notes}</p>
      )}
      <p className="text-sm text-on-surface">
        {order.payment_method === 'cash' ? text('Cash on delivery') : order.payment_method} ·{' '}
        {order.payment_status}
      </p>
    </Card>
  );
}
