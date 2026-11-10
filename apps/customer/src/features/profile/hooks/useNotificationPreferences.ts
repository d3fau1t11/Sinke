import { useState } from 'react';
import { isDemoSession } from '@senik/api';
import {
  requestPhoneNotifications,
  disablePhoneNotifications,
} from '@senik/native/notificationPermission';
import { useNotificationStore } from '../store/notificationStore';

export function useNotificationPreferences() {
  const preferences = useNotificationStore();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const demo = isDemoSession();
  const setOrderUpdates = async (enabled: boolean) => {
    setPending(true);
    setError('');
    try {
      if (enabled) await requestPhoneNotifications();
      else await disablePhoneNotifications();
      preferences.setPreference('orderUpdates', enabled);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : 'Could not enable notifications. Try again.',
      );
    } finally {
      setPending(false);
    }
  };
  return { ...preferences, pending, error, demo, setOrderUpdates };
}
