import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import type { useAdminZones } from '../hooks/useAdminZones';
import { Card } from '@senik/ui';

type Props = { zones: ReturnType<typeof useAdminZones>['zones'] };
export function AdminZonesSection1({ zones }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {zones.map((zone) => (
        <Card
          key={zone.id}
          variant="outlined"
          padding="lg"
          className="bg-slate-900 border-slate-800 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base text-white">{localizedName(zone)}</h3>
              <p className="text-xs text-slate-400">{zone.name_am}</p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              {text('Active')}
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{text('Subcity:')}</span>
              <span className="text-slate-200 font-medium">{zone.subcity_en}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{text('Base Delivery Fee:')}</span>
              <span className="text-emerald-400 font-bold font-mono">
                {zone.delivery_fee} {text('ETB')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{text('Standard ETA:')}</span>
              <span className="text-slate-200 font-medium">{zone.delivery_eta}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-primary">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>{text('Supported by Bajaj & Motor dispatch')}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
