import { useText } from '@senik/i18n';
import { Button, Card } from '@senik/ui';
import { formatETB } from '@senik/utils';
import type { useCart } from '../hooks/useCart';

type Props = { model: ReturnType<typeof useCart> };
export function CartTotals({ model }: Props) {
  const text = useText();
  const labels = model.isAm
    ? ['ንዑስ ድምር', 'የማድረሻ ክፍያ', 'የአገልግሎት ክፍያ', 'ጠቅላላ']
    : ['Subtotal', 'Delivery Fee', 'Service Fee', 'Total'];
  return (
    <Card variant="elevated" padding="lg" className="rounded-2xl shadow-level-3 space-y-3">
      {[model.subtotal, model.deliveryFee, model.serviceFee, model.total].map((amount, index) => (
        <div key={index} className="flex justify-between font-semibold text-on-surface">
          <span>{text(labels[index] ?? '')}</span>
          <span>{formatETB(amount, model.isAm)}</span>
        </div>
      ))}
      {model.error && (
        <p role="alert" className="text-error">
          {text(model.error ?? '')}
        </p>
      )}
      <Button
        size="xl"
        fullWidth
        disabled={!model.quoteReady}
        onClick={() => model.navigate('/app/checkout')}
      >
        {model.isAm ? 'ወደ ክፍያ ቀጥል' : text('Proceed to Checkout')}
      </Button>
      <Button variant="ghost" size="sm" fullWidth onClick={model.clearCart}>
        {model.isAm ? 'ቅርጫትን አጽዳ' : text('Clear Cart')}
      </Button>
    </Card>
  );
}
