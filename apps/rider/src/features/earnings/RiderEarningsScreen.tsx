import { useText } from '@senik/i18n';
import { Button, Skeleton } from '@senik/ui';
import { WalletSummary } from '@senik/ui/WalletSummary';
import { PayoutHistory } from '@senik/ui/PayoutHistory';
import { useRiderEarnings } from './hooks/useRiderEarnings';
import { RiderWithdrawalModal } from './RiderWithdrawalModal';

export function RiderEarningsScreen() {
  const text = useText();
  const {
    riderId,
    balance,
    lifetimeEarnings,
    withdrawals,
    loading,
    showWithdrawal,
    setShowWithdrawal,
    delivered,
    todayEarnings,
  } = useRiderEarnings();
  const pending = withdrawals
    .filter((payout) => payout.status === 'pending')
    .reduce((sum, payout) => sum + payout.amount, 0);
  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-title-lg text-on-surface">
        {text('My Earnings')}
      </h1>
      {loading ? (
        <Skeleton variant="rectangular" height="150px" />
      ) : (
        <WalletSummary balance={balance} earned={lifetimeEarnings} pending={pending} />
      )}
      <p className="text-on-surface-variant text-sm">
        {text('Today:')}
        {todayEarnings} {text('ETB · Completed deliveries:')} {delivered.length}
      </p>
      <Button fullWidth disabled={balance < 50 || loading} onClick={() => setShowWithdrawal(true)}>
        {text('Request Withdrawal')}
      </Button>
      <PayoutHistory payouts={withdrawals} />
      <RiderWithdrawalModal
        riderId={riderId ?? ''}
        isOpen={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
        onSuccess={() => setShowWithdrawal(false)}
      />
    </div>
  );
}
