import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ordersApi } from '@senik/api';
import type { OrderSummary } from '@senik/types';
import { useMerchantAuthStore } from '../../auth/store/merchantAuthStore';
import { useMerchantWalletStore } from '../../finances/store/merchantWalletStore';

export function useMerchantDashboard() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { merchantId, businessName } = useMerchantAuthStore();
  const { withdrawals } = useMerchantWalletStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!merchantId) return;
      try {
        const data = await ordersApi.getByBusiness(merchantId);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load merchant orders. Try again.');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [merchantId]);

  const incoming = orders.filter((o) => o.status === 'placed');
  const preparing = orders.filter((o) => o.status === 'preparing' || o.status === 'accepted');
  const ready = orders.filter((o) => o.status === 'ready');
  const delivered = orders.filter((o) => o.status === 'delivered');
  const grossEarnings = delivered.reduce((sum, o) => sum + o.subtotal, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.businessId === merchantId)
    .reduce((s, w) => s + w.amount, 0);
  const availableBalance = Math.max(0, grossEarnings - totalWithdrawn);

  return {
    error,
    navigate,
    merchantId,
    businessName,
    withdrawals,
    orders,
    setOrders,
    loading,
    setLoading,
    incoming,
    preparing,
    ready,
    delivered,
    grossEarnings,
    totalWithdrawn,
    availableBalance,
  };
}
