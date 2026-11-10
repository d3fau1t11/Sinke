import { useText } from '@senik/i18n';
import { MerchantDashboardSection2 } from './MerchantDashboardSection2';

import type { useMerchantDashboard } from '../hooks/useMerchantDashboard';
import { Card, Button, Skeleton } from '@senik/ui';

type Props = {
  navigate: ReturnType<typeof useMerchantDashboard>['navigate'];
  loading: ReturnType<typeof useMerchantDashboard>['loading'];
  incoming: ReturnType<typeof useMerchantDashboard>['incoming'];
};
export function MerchantDashboardSection3({ navigate, loading, incoming }: Props) {
  const text = useText();
  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-title-md text-on-surface">
          {text('Live Order Queue')}
        </h3>
        <Button size="sm" variant="ghost" onClick={() => navigate('/orders')}>
          {text('View All')}
        </Button>
      </div>
      {loading ? (
        <div className="space-y-2 py-1">
          <Skeleton variant="rectangular" height="56px" />
          <Skeleton variant="rectangular" height="56px" />
        </div>
      ) : incoming.length > 0 ? (
        <MerchantDashboardSection2 {...{ navigate, incoming }} />
      ) : (
        <div className="py-6 flex flex-col items-center text-center gap-1.5">
          <span className="material-symbols-outlined text-[28px] text-secondary">check_circle</span>
          <p className="text-body-sm text-on-surface-variant">
            {text('All caught up — no pending orders right now.')}
          </p>
        </div>
      )}
    </Card>
  );
}
