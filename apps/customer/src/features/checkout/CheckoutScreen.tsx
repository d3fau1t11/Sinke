import { useText } from '@senik/i18n';
import { CheckoutSection2 } from './components/CheckoutSection2';
import { CheckoutSection1 } from './components/CheckoutSection1';
import { Button, Card, EmptyState } from '@senik/ui';
import { formatETB } from '@senik/utils';
import { useCheckout } from './hooks/useCheckout';

export function CheckoutScreen() {
  const text = useText();
  const model = useCheckout();
  if (!model.items.length)
    return (
      <EmptyState
        t={model.t}
        isAm={model.isAm}
        title={text('Your cart is empty')}
        actionLabel={text('Browse Food')}
        onAction={() => model.navigate('/app/home')}
      />
    );
  return (
    <form
      className="p-4 space-y-5 max-w-2xl mx-auto"
      onSubmit={(event) => {
        event.preventDefault();
        model.mutation.mutate();
      }}
    >
      <h1 className="font-display font-bold text-xl text-on-surface">
        {model.isAm ? 'ክፍያ' : text('Checkout')}
      </h1>
      <CheckoutSection2 {...{ model }} />
      <CheckoutSection1 {...{ model }} />
      {(model.mutation.error || model.quoteError) && (
        <p role="alert" className="text-error">
          {model.mutation.error?.message || model.quoteError}
        </p>
      )}
      <Card padding="lg" className="space-y-3">
        {[
          ['Subtotal', model.subtotal],
          ['Delivery Fee', model.deliveryFee],
          ['Service Fee', model.serviceFee],
          ['Total', model.total],
        ].map(([label, amount]) => (
          <div key={label} className="flex justify-between font-semibold text-on-surface">
            <span>{text(label ?? '')}</span>
            <span>{formatETB(Number(amount))}</span>
          </div>
        ))}
        <Button
          type="submit"
          size="lg"
          fullWidth
          disabled={!model.quoteReady}
          loading={model.mutation.isPending}
        >
          {model.isDemo ? text('Place Demo Order') : text('Place Order')}
        </Button>
      </Card>
    </form>
  );
}
