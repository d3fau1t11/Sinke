import { useText } from '@senik/i18n';
import { EmptyState } from '@senik/ui';
import { OrderCard } from '../OrderCard';
import { MerchantOrdersSection2 } from './MerchantOrdersSection2';
import type { useMerchantOrders } from '../hooks/useMerchantOrders';

type Props = Pick<
  ReturnType<typeof useMerchantOrders>,
  'loading' | 'filteredOrders' | 'handleUpdateStatus' | 'updatingId'
>;

export function MerchantOrderList({
  loading,
  filteredOrders,
  handleUpdateStatus,
  updatingId,
}: Props) {
  const text = useText();
  if (loading) return <MerchantOrdersSection2 />;
  if (!filteredOrders.length)
    return (
      <EmptyState
        t={(key) => key}
        isAm={false}
        title={text('No orders in this status')}
        message={text('New customer orders will appear here.')}
        icon={<span className="material-symbols-outlined text-[40px]">receipt_long</span>}
      />
    );
  return (
    <div className="space-y-3">
      {filteredOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdateStatus={handleUpdateStatus}
          updatingId={updatingId}
        />
      ))}
    </div>
  );
}
