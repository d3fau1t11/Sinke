import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi, getDemoRole } from '@senik/api';
import { useMerchantAuthStore } from '../../auth/store/merchantAuthStore';
import { useMerchantWalletStore } from '../store/merchantWalletStore';

export function useMerchantFinances() {
  const { merchantId, businessName } = useMerchantAuthStore();
  const payouts = useMerchantWalletStore((state) => state.withdrawals).filter(
    (row) => row.businessId === merchantId,
  );
  const query = useQuery({
    queryKey: ['merchant-finances', getDemoRole(), merchantId],
    queryFn: () => ordersApi.getByBusiness(merchantId!),
    enabled: Boolean(merchantId),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const earned = (query.data ?? [])
    .filter((order) => order.status === 'delivered')
    .reduce((sum, order) => sum + order.subtotal, 0);
  const withdrawn = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const pending = payouts
    .filter((payout) => payout.status === 'pending')
    .reduce((sum, payout) => sum + payout.amount, 0);
  return {
    merchantId,
    businessName,
    payouts,
    query,
    isModalOpen,
    setIsModalOpen,
    earned,
    pending,
    balance: Math.max(0, earned - withdrawn),
  };
}
