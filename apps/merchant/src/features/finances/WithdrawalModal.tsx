import { WithdrawalSheet } from '@senik/ui/WithdrawalSheet';
import { useMerchantWithdrawal } from './hooks/useMerchantWithdrawal';

interface WithdrawalModalProps {
  businessId: string;
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawalModal({
  businessId,
  availableBalance,
  isOpen,
  onClose,
  onSuccess,
}: WithdrawalModalProps) {
  const model = useMerchantWithdrawal(businessId, availableBalance, onSuccess, onClose);
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
