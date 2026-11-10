import { useText } from '@senik/i18n';
import { Button, EmptyState, Skeleton } from '@senik/ui';
import { useOrderScreen } from './hooks/useOrderScreen';
import { OrderSummaryCard } from './components/OrderSummaryCard';

export function OrderDetailScreen() {
  const text = useText();
  const { query, navigate, isAm, t } = useOrderScreen();
  if (query.isPending) return <Skeleton variant="rectangular" height="220px" />;
  if (!query.data || query.isError)
    return (
      <EmptyState
        t={t}
        isAm={isAm}
        title={text('Order not found')}
        message={query.error?.message ?? ''}
        actionLabel={text('Back to Orders')}
        onAction={() => navigate('/app/orders')}
      />
    );
  const order = query.data;
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-xl text-on-surface">
        {isAm ? 'የትዕዛዝ ዝርዝር' : text('Order Details')}
      </h1>
      <OrderSummaryCard order={order} isAm={isAm} />
      <Button fullWidth onClick={() => navigate(`/app/tracking/${order.id}`)}>
        {text('Track Order')}
      </Button>
      <Button variant="secondary" fullWidth onClick={() => navigate('/app/orders')}>
        {text('All Orders')}
      </Button>
    </div>
  );
}
