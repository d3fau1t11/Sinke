import { useState, useEffect } from 'react';
import { ordersApi } from '@senik/api';

import type { OrderSummary } from '@senik/types';
import { useRiderAuthStore } from '../../auth/store/riderAuthStore';
import { useRiderWalletStore } from '.././store/riderWalletStore';

export function useRiderEarnings() {
  const { riderId } = useRiderAuthStore();
  const { balance, lifetimeEarnings, withdrawals } = useRiderWalletStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  useEffect(() => {
    async function load() {
      if (!riderId) return;
      try {
        const data = await ordersApi.getRiderOrders(riderId);
        setOrders(data);
        const earned = data
          .filter((order) => order.status === 'delivered')
          .reduce((sum, order) => sum + order.delivery_fee, 0);
        const withdrawn = useRiderWalletStore
          .getState()
          .withdrawals.filter((row) => row.riderId === riderId)
          .reduce((sum, row) => sum + row.amount, 0);
        useRiderWalletStore.setState({
          lifetimeEarnings: earned,
          balance: Math.max(0, earned - withdrawn),
        });
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [riderId]);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const today = new Date().toDateString();
  const todayEarnings = delivered
    .filter((o) => new Date(o.created_at).toDateString() === today)
    .reduce((acc, o) => acc + (o.delivery_fee || 0), 0);

  return {
    riderId,
    balance,
    lifetimeEarnings,
    withdrawals,
    orders,
    setOrders,
    loading,
    setLoading,
    showWithdrawal,
    setShowWithdrawal,
    delivered,
    today,
    todayEarnings,
  };
}
