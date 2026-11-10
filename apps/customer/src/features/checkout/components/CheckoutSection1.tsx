import { PaymentLogo } from '@senik/ui/PaymentLogo';
import { useText } from '@senik/i18n';
import { Card } from '@senik/ui';

import type { useCheckout } from '../hooks/useCheckout';
import type { CheckoutMethod } from '../hooks/useCheckout';

type Props = { model: ReturnType<typeof useCheckout> };
export function CheckoutSection1({ model }: Props) {
  const text = useText();
  return (
    <Card variant="outlined" padding="lg" className="space-y-3">
      <h2 className="font-bold text-on-surface">{text('Payment Method')}</h2>
      {(['cash', 'telebirr', 'cbe_birr'] as CheckoutMethod[]).map((method) => (
        <label
          key={method}
          className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant"
        >
          <input
            type="radio"
            name="payment"
            value={method}
            checked={model.method === method}
            disabled={!model.isDemo && method !== 'cash'}
            onChange={() => model.setMethod(method)}
          />
          {method !== 'cash' && <PaymentLogo method={method} />}
          <span className="text-on-surface">
            {method === 'cash'
              ? text('Cash on Delivery')
              : method === 'telebirr'
                ? text('Telebirr')
                : text('CBE Birr')}
            {method !== 'cash' && (
              <small className="block text-on-surface-variant">
                {model.isDemo ? text('Simulated payment in demo') : text('Currently unavailable')}
              </small>
            )}
          </span>
        </label>
      ))}
    </Card>
  );
}
