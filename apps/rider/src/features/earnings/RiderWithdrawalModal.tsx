import { WithdrawalSheet } from '@senik/ui/WithdrawalSheet';
import { useRiderWithdrawal } from './hooks/useRiderWithdrawal';
import { useRiderWalletStore } from './store/riderWalletStore';

interface RiderWithdrawalModalProps {
  riderId: string;

  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RiderWithdrawalModal({
  riderId,
  isOpen,
  onClose,
  onSuccess,
}: RiderWithdrawalModalProps) {
  const availableBalance = useRiderWalletStore((state) => state.balance);
  const model = useRiderWithdrawal(riderId, availableBalance, onSuccess, onClose);
  return (
    <WithdrawalSheet
      visible={isOpen}
      balance={availableBalance}
      form={model.form}
      onChange={model.setForm}
      error={model.error}
      reference={model.reference}
      onSubmit={model.submit}
      onClose={model.close}
    />
  );
}
