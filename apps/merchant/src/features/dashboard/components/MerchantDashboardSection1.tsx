import { useText } from '@senik/i18n';
import type { useMerchantDashboard } from '../hooks/useMerchantDashboard';

import { PipelineTile } from '../PipelineTile';

type Props = {
  navigate: ReturnType<typeof useMerchantDashboard>['navigate'];
  incoming: ReturnType<typeof useMerchantDashboard>['incoming'];
  preparing: ReturnType<typeof useMerchantDashboard>['preparing'];
  ready: ReturnType<typeof useMerchantDashboard>['ready'];
  delivered: ReturnType<typeof useMerchantDashboard>['delivered'];
};
export function MerchantDashboardSection1({
  navigate,
  incoming,
  preparing,
  ready,
  delivered,
}: Props) {
  const text = useText();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <PipelineTile
        label={text('Incoming')}
        count={incoming.length}
        helper="Needs action"
        icon="notifications_active"
        tone="primary"
        onClick={() => navigate('/orders?tab=placed')}
      />
      <PipelineTile
        label={text('Preparing')}
        count={preparing.length}
        helper="In kitchen"
        icon="skillet"
        tone="progress"
        onClick={() => navigate('/orders?tab=preparing')}
      />
      <PipelineTile
        label={text('Ready')}
        count={ready.length}
        helper="Awaiting rider"
        icon="inventory_2"
        tone="success"
        onClick={() => navigate('/orders?tab=ready')}
      />
      <PipelineTile
        label={text('Completed')}
        count={delivered.length}
        helper="Balance credited"
        icon="check_circle"
        tone="neutral"
        onClick={() => navigate('/orders?tab=completed')}
      />
    </div>
  );
}
