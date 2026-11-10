import { useText } from '@senik/i18n';
import { Card, Input, Textarea } from '@senik/ui';

import type { useCheckout } from '../hooks/useCheckout';

type Props = { model: ReturnType<typeof useCheckout> };
export function CheckoutSection2({ model }: Props) {
  const text = useText();
  return (
    <Card variant="outlined" padding="lg" className="space-y-4">
      <h2 className="font-bold text-on-surface">{text('Delivery Details')}</h2>
      <Textarea
        label={text('Delivery Address')}
        value={model.address}
        onChange={(event) => model.setAddress(event.target.value)}
        required
        fullWidth
        rows={3}
      />
      <Input
        label={text('Phone Number')}
        type="tel"
        value={model.phone}
        onChange={(event) => model.setPhone(event.target.value)}
        required
        fullWidth
      />
      <Input
        label={text('Delivery Notes (Optional)')}
        value={model.notes}
        onChange={(event) => model.setNotes(event.target.value)}
        fullWidth
      />
    </Card>
  );
}
