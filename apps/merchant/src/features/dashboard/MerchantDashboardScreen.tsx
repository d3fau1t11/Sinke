import { useText } from '@senik/i18n';
import { MerchantDashboardSection3 } from './components/MerchantDashboardSection3';

import { MerchantDashboardSection1 } from './components/MerchantDashboardSection1';
import { useMerchantDashboard } from './hooks/useMerchantDashboard';

import { Card, Button } from '@senik/ui';

import { formatETB } from '@senik/utils';

export function MerchantDashboardScreen() {
  const text = useText();
  const {
    error,
    navigate,
    businessName,
    loading,
    incoming,
    preparing,
    ready,
    delivered,
    availableBalance,
  } = useMerchantDashboard();
  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {text(error ?? '')}
        </p>
      )}
      <div>
        <h2 className="font-display font-bold text-title-lg text-on-surface">
          {text('Store Overview')}
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          {text('Live operations for')} {businessName}
        </p>
      </div>

      {/* Available balance — money is always green */}
      <Card padding="md" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </span>
          <div>
            <p className="text-micro font-bold uppercase tracking-[0.05em] text-on-surface-variant">
              {text('Available Balance')}
            </p>
            <p className="font-display font-black text-display text-secondary tabular-nums leading-tight">
              {formatETB(availableBalance)}
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => navigate('/finances')}>
          {text('Payout')}
        </Button>
      </Card>

      {/* Order pipeline — tap a stage to open the filtered queue */}
      <MerchantDashboardSection1 {...{ navigate, incoming, preparing, ready, delivered }} />

      {/* Live order queue */}
      <MerchantDashboardSection3 {...{ navigate, loading, incoming }} />
    </div>
  );
}
