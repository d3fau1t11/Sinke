import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@senik/api';

import type { OrderSummary } from '@senik/types';
import { useRiderAuthStore } from '../../auth/store/riderAuthStore';
import { useDeliveryProgress } from './useDeliveryProgress';

export function useActiveDelivery() {
  const navigate = useNavigate();
  const { riderId } = useRiderAuthStore();
  const [activeOrder, setActiveOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [error, setError] = useState('');

  const loadActiveOrder = async () => {
    if (!riderId) {
      setLoading(false);
      return;
    }
    try {
      const orders = await ordersApi.getRiderOrders(riderId);
      const pickedUp = orders.find((o) => o.status === 'picked_up');
      const accepted = orders.find((o) => o.status === 'accepted');
      if (pickedUp) {
        setActiveOrder(pickedUp);
        setStep(1);
      } else if (accepted) {
        setActiveOrder(accepted);
        setStep(0);
      } else setActiveOrder(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your active delivery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadActiveOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riderId]);

  const progress = useDeliveryProgress({
    activeOrder,
    setActiveOrder,
    riderId,
    step,
    setStep,
  });

  return {
    navigate,
    activeOrder,
    loading,
    ...progress,
    step,
    error: error || progress.error,
  };
}
