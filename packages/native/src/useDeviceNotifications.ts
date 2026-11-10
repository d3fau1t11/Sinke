import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PushNotifications } from '@capacitor/push-notifications';
import { registerDeviceToken, getRegisteredDeviceToken, isDemoSession } from '@senik/api';
import { i18n } from '@senik/i18n';
import { isAndroid } from './device';
import { requestPhoneNotifications, disablePhoneNotifications } from './notificationPermission';

export function useDeviceNotifications(destination = '/app/tracking/') {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!isAndroid()) return;
    const save = (value: string) =>
      registerDeviceToken(value, i18n.resolvedLanguage === 'en' ? 'en' : 'am');
    const registered = PushNotifications.addListener('registration', ({ value }) => {
      void save(value)
        .then(
          () => setStatus('Notifications enabled'),
          () => setStatus('Could not enable notifications. Try again.'),
        )
        .finally(() => setPending(false));
    });
    const failed = PushNotifications.addListener('registrationError', () => {
      setStatus('Notifications need Firebase configuration for this app.');
      setPending(false);
    });
    const tap = PushNotifications.addListener('pushNotificationActionPerformed', (event) => {
      const id: unknown = event.notification.data?.orderId;
      if (typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id)) {
        navigate(destination.endsWith('/') ? destination + id : destination);
      }
    });
    const changed = () => {
      const current = getRegisteredDeviceToken();
      if (current)
        void save(current).catch(() => setStatus('Could not enable notifications. Try again.'));
    };
    i18n.on('languageChanged', changed);
    return () => {
      void registered.then((listener) => listener.remove());
      void failed.then((listener) => listener.remove());
      void tap.then((listener) => listener.remove());
      i18n.off('languageChanged', changed);
    };
  }, [destination, navigate]);
  const enable = async () => {
    if (isDemoSession()) {
      setStatus('Demo mode does not send notifications.');
      return false;
    }
    if (!isAndroid()) {
      setStatus('Enable notifications in the Android app.');
      return false;
    }
    setPending(true);
    try {
      await requestPhoneNotifications();
      return true;
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Notifications need Firebase configuration for this app.',
      );
      setPending(false);
      return false;
    }
  };
  const disable = async () => {
    await disablePhoneNotifications();
    setStatus('Notifications disabled');
  };
  return { enable, disable, status, pending };
}
