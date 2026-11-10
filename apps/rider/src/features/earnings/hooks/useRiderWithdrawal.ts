import { useState } from 'react';
import { isDemoSession } from '@senik/api';
import type { WithdrawalForm } from '@senik/ui/WithdrawalSheet';
import { useRiderWalletStore } from '../store/riderWalletStore';

const blank: WithdrawalForm = {
  method: 'cbe',
  amount: '',
  accountNumber: '',
  accountName: '',
};

export function useRiderWithdrawal(
  riderId: string,
  balance: number,
  onSuccess: () => void,
  onClose: () => void,
) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const submit = () => {
    const amount = Number(form.amount);
    if (!isDemoSession()) {
      setError('Demo sign-in is required.');
      return;
    }
    if (!Number.isFinite(amount) || amount < 50 || amount > balance) {
      setError('Enter an amount between 50 ETB and your available balance.');
      return;
    }
    if (!form.accountNumber.trim() || !form.accountName.trim()) {
      setError('Enter sample account details.');
      return;
    }
    try {
      const result = useRiderWalletStore.getState().requestWithdrawal({
        riderId,
        amount,
        method: form.method,
        accountNumber: form.accountNumber.trim(),
        accountName: form.accountName.trim(),
      });
      setReference(result.referenceNumber);
      setError('');
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not record withdrawal.');
    }
  };
  const close = () => {
    setForm(blank);
    setError('');
    setReference('');
    onSuccess();
    onClose();
  };
  return { form, setForm, error, reference, submit, close };
}
