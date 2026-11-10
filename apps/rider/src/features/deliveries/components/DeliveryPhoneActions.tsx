import { useText } from '@senik/i18n';
import type { OrderSummary } from '@senik/types';

export function DeliveryPhoneActions({ order }: { order: OrderSummary }) {
  const text = useText();
  const business = order.business;
  const pickup = business?.latitude != null && business.longitude != null
    ? `${business.latitude},${business.longitude}` : business?.name_en ?? '';
  const destination = order.status === 'accepted' ? pickup : order.delivery_address;
  const phone = order.customer?.phone.replace(/[^+\d]/g, '');
  return <div className="flex flex-wrap gap-4">
    {destination && <a className="text-primary underline font-bold" target="_blank" rel="noopener noreferrer"
      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`}>
      {text('Open directions')}
    </a>}
    {phone && <a className="text-primary underline font-bold" href={`tel:${phone}`}>
      {text('Call customer')}
    </a>}
  </div>;
}
