import { businessesApi } from '@senik/api';
import { useState } from 'react';
import { useApp } from '@senik/i18n';

import { useMerchantAuthStore } from '../../features/auth/store/merchantAuthStore';

export function useMerchantHeader() {
  const { merchantId, businessName, businessNameAm, isOpen, setIsOpen, logout } =
    useMerchantAuthStore();
  const { isAm } = useApp();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handleToggleOpen = async () => {
    if (!merchantId || pending) return;
    setPending(true);
    setError('');
    const nextState = !isOpen;
    try {
      await businessesApi.setIsOpen(merchantId, nextState);
      setIsOpen(nextState);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update store status.');
    } finally {
      setPending(false);
    }
  };

  return {
    businessName: isAm ? businessNameAm || businessName : businessName,
    isOpen,
    logout,
    handleToggleOpen,
    pending,
    error,
  };
}
