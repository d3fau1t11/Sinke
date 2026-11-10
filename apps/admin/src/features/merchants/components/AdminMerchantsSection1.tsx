import { useLocalizedName } from '@senik/i18n';
import { useText } from '@senik/i18n';
import type { useAdminMerchants } from '../hooks/useAdminMerchants';
import { Card } from '@senik/ui';

type Props = {
  togglingId: ReturnType<typeof useAdminMerchants>['togglingId'];
  handleToggleOpen: ReturnType<typeof useAdminMerchants>['handleToggleOpen'];
  biz: NonNullable<ReturnType<typeof useAdminMerchants>['businesses']>[number];
};
export function AdminMerchantsSection1({ togglingId, handleToggleOpen, biz }: Props) {
  const localizedName = useLocalizedName();
  const text = useText();
  return (
    <Card
      key={biz.id}
      variant="outlined"
      padding="md"
      className="bg-slate-900 border-slate-800 flex items-center gap-3"
    >
      <img
        src={biz.avatar_image}
        alt={localizedName(biz)}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white truncate">{localizedName(biz)}</h3>
          <span className="text-[11px] text-amber-400 font-bold flex items-center">
            ★ {biz.rating}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">{biz.name_am}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {text('Fee:')}
          {biz.delivery_fee} {text('ETB • ETA:')} {biz.delivery_eta}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <button
          type="button"
          disabled={togglingId === biz.id}
          onClick={() => void handleToggleOpen(biz)}
          className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
            biz.is_open
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
              : 'bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900'
          }`}
        >
          {togglingId === biz.id ? '...' : biz.is_open ? text('OPEN') : text('CLOSED')}
        </button>
        <span className="text-[10px] text-slate-500">{text('Click to switch')}</span>
      </div>
    </Card>
  );
}
