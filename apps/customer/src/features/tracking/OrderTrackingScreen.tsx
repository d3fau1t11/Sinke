import { useText } from '@senik/i18n';
import { OrderTrackingSection1 } from './components/OrderTrackingSection1';
import { Button, EmptyState, Skeleton } from '@senik/ui';
import { useOrderScreen } from '../orders/hooks/useOrderScreen';
import { OrderSummaryCard } from '../orders/components/OrderSummaryCard';

import { stages } from './stages';

export function OrderTrackingScreen() {
  const text = useText();
  const { query, navigate, isAm, t, isDemo, advance } = useOrderScreen();
  if (query.isPending) return <Skeleton variant="rectangular" height="220px" />;
  if (!query.data || query.isError)
    return (
      <EmptyState
        t={t}
        isAm={isAm}
        title={text('Order not found')}
        actionLabel={text('Back to Orders')}
        onAction={() => navigate('/app/orders')}
      />
    );
  const order = query.data;
  const current = stages.indexOf(order.status);
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-xl text-on-surface">{text('Track Order')}</h1>
      <OrderTrackingSection1 {...{ isDemo, advance, order, current }} />
      <OrderSummaryCard order={order} isAm={isAm} />
      <Button variant="secondary" fullWidth onClick={() => navigate('/app/orders')}>
        {text('All Orders')}
      </Button>
    </div>
  );
}
