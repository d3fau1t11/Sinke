import { useText } from '@senik/i18n';
import { Button, Skeleton } from '@senik/ui';
import { useOrders } from './hooks/useOrders';
import { CustomerOrderCard } from './components/CustomerOrderCard';

export function OrdersScreen() {
  const text = useText();
  const model = useOrders();
  return <div className="p-4 space-y-4">
    <h1 className="font-bold text-xl">{text('Your Orders')}</h1>
    <div className="flex gap-3">
      {['active', 'past'].map((tab) => <Button key={tab}
        variant={model.tab === tab ? 'primary' : 'secondary'} onClick={() => model.setTab(tab)}>
        {text(tab === 'active' ? 'Active' : 'Past')}
      </Button>)}
    </div>
    {model.query.isPending ? <Skeleton variant="rectangular" height="150px" /> : model.orders.map((order) =>
      <CustomerOrderCard key={order.id} order={order} onSelect={(id) => model.navigate('/app/orders/' + id)} />)}
    {model.query.error && <p role="alert">{text('Could not load orders. Try again.')}</p>}
    {!model.query.isPending && !model.orders.length && <p>{text('No orders found')}</p>}
  </div>;
}
