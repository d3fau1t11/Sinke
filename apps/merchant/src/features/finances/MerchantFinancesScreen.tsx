import { useText } from '@senik/i18n';
import { Button, Skeleton } from '@senik/ui';
import { WalletSummary } from '@senik/ui/WalletSummary';
import { PayoutHistory } from '@senik/ui/PayoutHistory';
import { useMerchantFinances } from './hooks/useMerchantFinances';
import { WithdrawalModal } from './WithdrawalModal';

export function MerchantFinancesScreen() {
  const text = useText();
  const {
    merchantId,
    businessName,
    payouts,
    query,
    isModalOpen,
    setIsModalOpen,
    earned,
    pending,
    balance,
  } = useMerchantFinances();
  return (
    <div className="space-y-5">
      <h1 className="font-display font-bold text-title-lg text-on-surface">
        {text('Finances & Payouts')}
      </h1>
      <p className="text-on-surface-variant text-sm">{businessName}</p>
      {query.isError && (
        <p role="alert" className="text-error">
          {text(query.error.message ?? '')}
        </p>
      )}
      {query.isPending ? (
        <Skeleton variant="rectangular" height="150px" />
      ) : (
        <WalletSummary balance={balance} earned={earned} pending={pending} />
      )}
      <Button
        fullWidth
        disabled={balance < 50 || query.isPending}
        onClick={() => setIsModalOpen(true)}
      >
        {text('Request Withdrawal')}
      </Button>
      <PayoutHistory payouts={payouts} />
      <WithdrawalModal
        businessId={merchantId ?? ''}
        availableBalance={balance}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => void query.refetch()}
      />
    </div>
  );
}
