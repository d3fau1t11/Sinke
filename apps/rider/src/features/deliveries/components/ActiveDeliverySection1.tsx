import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import { Card } from '@senik/ui';
import { DeliveryPhoneActions } from './DeliveryPhoneActions';
import { formatETB } from '@senik/utils';

import type { useActiveDelivery } from '../hooks/useActiveDelivery';

type Props = {
  activeOrder: NonNullable<ReturnType<typeof useActiveDelivery>['activeOrder']>;
};
export function ActiveDeliverySection1({ activeOrder }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <Card padding="lg" className="space-y-4">
      <div>
        <p className="text-xs text-on-surface-variant uppercase">{text('Pickup From')}</p>
        <h2 className="font-bold text-on-surface">{localizedName(activeOrder.business)}</h2>
      </div>
      <div className="border-t pt-3">
        <p className="text-xs text-on-surface-variant uppercase">{text('Deliver To')}</p>
        <p className="font-bold text-on-surface">{activeOrder.delivery_address}</p>
        <p className="text-sm text-on-surface-variant">{activeOrder.delivery_notes}</p>
      </div>
      <div className="border-t pt-3 flex justify-between gap-3">
        <div>
          <p className="text-xs text-on-surface-variant">{text('Payment')}</p>
          <p className="font-bold text-on-surface">
            {activeOrder.payment_method === 'cash'
              ? `${formatETB(activeOrder.total)} (${text('Cash')})`
              : text('Paid Online')}
          </p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant">{text('Your Earnings')}</p>
          <p className="font-bold text-secondary">+{formatETB(activeOrder.delivery_fee)}</p>
        </div>
      </div>
      <DeliveryPhoneActions order={activeOrder} />
    </Card>
  );
}
