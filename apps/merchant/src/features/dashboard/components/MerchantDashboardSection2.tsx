import { useText } from '@senik/i18n';
import type { useMerchantDashboard } from '../hooks/useMerchantDashboard';
import { Button } from '@senik/ui';

type Props = {
  navigate: ReturnType<typeof useMerchantDashboard>['navigate'];
  incoming: ReturnType<typeof useMerchantDashboard>['incoming'];
};
export function MerchantDashboardSection2({ navigate, incoming }: Props) {
  const text = useText();
  return (
    <div className="p-3.5 rounded-2xl bg-primary/5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[19px]">notifications_active</span>
        </span>
        <div className="min-w-0">
          <p className="font-bold text-title-sm text-on-surface">
            {incoming.length} {text('new incoming order')}
            {incoming.length > 1 ? 's' : ''}!
          </p>
          <p className="text-body-sm text-on-surface-variant">
            {text('Review and accept to begin preparation.')}
          </p>
        </div>
      </div>
      <Button size="sm" variant="primary" onClick={() => navigate('/orders?tab=placed')}>
        {text('Open')}
      </Button>
    </div>
  );
}
