import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addressesApi, getDemoRole } from '@senik/api';
import { useApp } from '@senik/i18n';
import { useAuthStore } from '../../auth/store/authStore';
import { useCartStore } from '../../cart/store/cartStore';
import { useAddressEditor } from './useAddressEditor';

export function useProfile() {
  const app = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();
  const auth = useAuthStore();
  const [error, setError] = useState('');
  const addresses = useQuery({
    queryKey: ['addresses', getDemoRole()],
    queryFn: addressesApi.getMyAddresses,
  });
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ['addresses'] });
  };
  const editor = useAddressEditor(refresh);
  const remove = useMutation({
    mutationFn: addressesApi.deleteAddress,
    onSuccess: refresh,
  });
  const setDefault = useMutation({
    mutationFn: addressesApi.setDefault,
    onSuccess: refresh,
  });
  const logout = async () => {
    try {
      await auth.logout();
      useCartStore.getState().clearCart();
      client.clear();
      navigate('/auth/phone', { replace: true });
    } catch {
      setError('Could not sign out. Please try again.');
    }
  };
  return {
    ...app,
    navigate,
    user: auth.user,
    addresses,
    ...editor,
    remove,
    setDefault,
    logout,
    error,
  };
}
