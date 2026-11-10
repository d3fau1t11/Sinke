import { useText } from '@senik/i18n';
import { AdminZonesSection1 } from './components/AdminZonesSection1';
import { useAdminZones } from './hooks/useAdminZones';

export function AdminZonesScreen() {
  const text = useText();
  const { error, zones, loading } = useAdminZones();
  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div>
        <h1 className="text-2xl font-bold text-white">{text('Hyperlocal Delivery Zones')}</h1>
        <p className="text-xs text-slate-400">
          {text('Coverage areas, delivery fees, and estimated transit times')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">{text('Loading delivery zones...')}</p>
        </div>
      ) : (
        <AdminZonesSection1 {...{ zones }} />
      )}
    </div>
  );
}
