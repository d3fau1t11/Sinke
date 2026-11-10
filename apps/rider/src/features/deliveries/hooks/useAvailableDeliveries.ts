import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@senik/api';
import type { OrderSummary } from '@senik/types';

import { useRiderAuthStore } from '../../auth/store/riderAuthStore';

export function useAvailableDeliveries() {
  const navigate = useNavigate();
  const { riderId, isOnline } = useRiderAuthStore();
  const [deliveries, setDeliveries] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadDeliveries = async () => {
    try {
      const data = await ordersApi.getAvailableForRiders();
      setDeliveries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load jobs. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDeliveries();
    const interval = setInterval(loadDeliveries, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = async (orderId: string) => {
    if (!riderId || acceptingId) return;
    if (!isOnline) {
      setError('Go online before accepting a job.');
      return;
    }
    setError('');
    setAcceptingId(orderId);
    try {
      await ordersApi.acceptDelivery(orderId, riderId);
      navigate('/active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept this job.');
    } finally {
      setAcceptingId(null);
    }
  };

  return {
    error,
    isOnline,
    deliveries,
    loading,
    acceptingId,
    loadDeliveries,
    handleAccept,
  };
}
