import { useText } from '@senik/i18n';
import { AdminOverviewSection1 } from './components/AdminOverviewSection1';
import { useAdminOverview } from './hooks/useAdminOverview';

import { Card } from '@senik/ui';
import { formatETB } from '@senik/utils';

export function AdminOverviewScreen() {
  const text = useText();
  const { error, orders, businesses, zones, loading, totalGMV, openMerchants } = useAdminOverview();
  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div>
        <h1 className="text-2xl font-bold text-white">{text('Platform Overview')}</h1>
        <p className="text-sm text-slate-400">
          {text('Live network activity across all Ethiopian zones')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="outlined" padding="md" className="bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">{text('TOTAL PLATFORM GMV')}</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{formatETB(totalGMV)}</p>
          <p className="text-[11px] text-slate-500 mt-1">{text('Across all orders')}</p>
        </Card>
        <Card variant="outlined" padding="md" className="bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">{text('TOTAL ORDERS')}</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{orders.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{text('Processed orders')}</p>
        </Card>
        <Card variant="outlined" padding="md" className="bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">{text('MERCHANTS ONLINE')}</p>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {openMerchants} / {businesses.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{text('Accepting orders')}</p>
        </Card>
        <Card variant="outlined" padding="md" className="bg-slate-900 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">{text('ACTIVE ZONES')}</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{zones.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{text('Koye, Tulu Dimtu, Akaki')}</p>
        </Card>
      </div>

      <AdminOverviewSection1 {...{ orders, loading }} />
    </div>
  );
}
