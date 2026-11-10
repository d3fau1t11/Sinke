import { useText } from '@senik/i18n';
import { AdminMerchantsSection1 } from './components/AdminMerchantsSection1';
import { useAdminMerchants } from './hooks/useAdminMerchants';

export function AdminMerchantsScreen() {
  const text = useText();
  const { error, businesses, loading, togglingId, loadMerchants, handleToggleOpen } =
    useAdminMerchants();
  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{text('Merchant Partners')}</h1>
          <p className="text-xs text-slate-400">
            {text('Manage store listings, operational status, and partners')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadMerchants()}
          className="text-xs text-primary font-semibold hover:underline"
        >
          {text('Refresh')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">{text('Loading merchants...')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <AdminMerchantsSection1 {...{ togglingId, handleToggleOpen, biz }} />
          ))}
        </div>
      )}
    </div>
  );
}
