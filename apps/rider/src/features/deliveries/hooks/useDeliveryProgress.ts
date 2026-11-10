import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ordersApi } from '@senik/api';
import type { OrderSummary } from '@senik/types';
import { useRiderWalletStore } from '../../earnings/store/riderWalletStore';

interface ProgressInput {
  activeOrder: OrderSummary | null;
  setActiveOrder: Dispatch<SetStateAction<OrderSummary | null>>;
  riderId: string | null;
  step: 0 | 1 | 2;
  setStep: Dispatch<SetStateAction<0 | 1 | 2>>;
}

export function useDeliveryProgress({
  activeOrder,
  setActiveOrder,
  riderId,
  step,
  setStep,
}: ProgressInput) {
  const { creditDelivery } = useRiderWalletStore();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const handlePickedUp = async () => {
    if (!activeOrder || updating) return;
    setError('');
    setUpdating(true);
    try {
      await ordersApi.updateStatus(activeOrder.id, 'picked_up');
      setStep(1);
      setActiveOrder((order) => (order ? { ...order, status: 'picked_up' } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not mark this order picked up.');
    } finally {
      setUpdating(false);
    }
  };
  const handleMarkDelivered = async () => {
    if (!activeOrder || !riderId || updating || step !== 1) return;
    setError('');
    setUpdating(true);
    try {
      await ordersApi.updateStatus(activeOrder.id, 'delivered');
      creditDelivery(riderId, activeOrder.delivery_fee ?? 0);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not complete this delivery.');
    } finally {
      setUpdating(false);
    }
  };
  return { updating, error, handlePickedUp, handleMarkDelivered };
}
