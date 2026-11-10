import { useState, useEffect } from 'react';
import { ordersApi } from '@senik/api';
import type { OrderSummary, OrderStatus } from '@senik/types';

export function useAdminOrders() {
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin orders. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      await loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status. Try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.status === filter;
  });

  return {
    error,
    orders,
    setOrders,
    loading,
    setLoading,
    filter,
    setFilter,
    updatingId,
    setUpdatingId,
    loadOrders,
    handleUpdateStatus,
    filtered,
  };
}
