import { useText } from '@senik/i18n';
import type { useAdminOrders } from '../hooks/useAdminOrders';
import { AdminOrderRow } from '../AdminOrderRow';

type Props = {
  loading: ReturnType<typeof useAdminOrders>['loading'];
  updatingId: ReturnType<typeof useAdminOrders>['updatingId'];
  handleUpdateStatus: ReturnType<typeof useAdminOrders>['handleUpdateStatus'];
  filtered: ReturnType<typeof useAdminOrders>['filtered'];
};
export function AdminOrdersSection1({ loading, updatingId, handleUpdateStatus, filtered }: Props) {
  const text = useText();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3 px-3">{text('Order #')}</th>
            <th className="py-3 px-3">{text('Merchant')}</th>
            <th className="py-3 px-3">{text('Destination')}</th>
            <th className="py-3 px-3">{text('Total')}</th>
            <th className="py-3 px-3">{text('Payment')}</th>
            <th className="py-3 px-3">{text('Status')}</th>
            <th className="py-3 px-3 text-right">{text('Force Action')}</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                {text('Loading orders...')}
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                {text('No orders in this status category.')}
              </td>
            </tr>
          ) : (
            filtered.map((order) => (
              <AdminOrderRow
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                updatingId={updatingId}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
