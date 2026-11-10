import { useState, useEffect } from 'react';
import { ordersApi } from '@senik/api';

import type { OrderSummary } from '@senik/types';
import { useRiderAuthStore } from '../../auth/store/riderAuthStore';

export function useDeliveryHistory() {
  const { riderId } = useRiderAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!riderId) return;
      try {
        const data = await ordersApi.getRiderOrders(riderId);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [riderId]);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const totalEarned = delivered.reduce((acc, o) => acc + (o.delivery_fee || 0), 0);

  return {
    riderId,
    orders,
    setOrders,
    loading,
    setLoading,
    delivered,
    totalEarned,
  };
}
