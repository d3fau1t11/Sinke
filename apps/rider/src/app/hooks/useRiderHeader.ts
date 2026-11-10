import { useEffect, useState } from 'react';
import { clearPhoneLocationWatch, watchPhoneLocation, getPhoneLocation } from '@senik/native';
import { publishRiderLocation, setRiderAvailability, isDemoSession } from '@senik/api';
import { useRiderAuthStore } from '../../features/auth/store/riderAuthStore';
import { useRiderWalletStore } from '../../features/earnings/store/riderWalletStore';

export function useRiderHeader() {
  const store = useRiderAuthStore();
  const { balance } = useRiderWalletStore();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const { isOnline, riderId, setCoords } = store;
  useEffect(() => {
    if (!isOnline || !riderId || isDemoSession()) return;
    let disposed = false;
    let id: string | undefined;
    let sending = false;
    const failed = () => setError('Location sharing failed. Check GPS and your connection.');
    void watchPhoneLocation((coords) => {
      if (disposed) return;
      setCoords(coords);
      if (sending) return;
      sending = true;
      void publishRiderLocation(coords)
        .then(() => setError(''), failed)
        .finally(() => {
          sending = false;
        });
    }, failed).then((watchId) => {
      if (disposed) void clearPhoneLocationWatch(watchId);
      else id = watchId;
    }, failed);
    return () => {
      disposed = true;
      if (id) void clearPhoneLocationWatch(id);
    };
  }, [isOnline, riderId, setCoords]);

  const toggleOnline = async () => {
    if (pending) return;
    setPending(true);
    setError('');
    try {
      if (!isOnline && !isDemoSession()) store.setCoords(await getPhoneLocation());
      await setRiderAvailability(!isOnline);
      store.setIsOnline(!isOnline);
    } catch {
      setError('Could not update availability. Check your connection.');
    } finally {
      setPending(false);
    }
  };
  return { ...store, balance, error, pending, toggleOnline };
}
