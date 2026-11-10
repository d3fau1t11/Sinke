import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import type { useAdminOverview } from '../hooks/useAdminOverview';
import { Card } from '@senik/ui';
import { formatETB } from '@senik/utils';

type Props = {
  orders: ReturnType<typeof useAdminOverview>['orders'];
  loading: ReturnType<typeof useAdminOverview>['loading'];
};
export function AdminOverviewSection1({ orders, loading }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <Card variant="outlined" padding="lg" className="bg-slate-900 border-slate-800 space-y-4">
      <h3 className="font-bold text-white text-base">{text('Recent Platform Activity')}</h3>
      {loading ? (
        <p className="text-xs text-slate-400 py-4 text-center">{text('Loading live orders...')}</p>
      ) : orders.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">
          {text('No customer orders placed yet.')}
        </p>
      ) : (
        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs"
            >
              <div>
                <span className="font-mono font-bold text-primary mr-2">#{order.order_number}</span>
                <span className="text-slate-300 font-medium">{localizedName(order.business)}</span>
                <span className="text-slate-500 ml-2">➔ {order.delivery_address}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-400">{formatETB(order.total)}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-700 text-slate-200">
                  {text(order.status ?? '')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
