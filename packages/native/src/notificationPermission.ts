import { PushNotifications } from '@capacitor/push-notifications';
import { isDemoSession, unregisterCurrentDeviceToken } from '@senik/api';
import { isAndroid } from './device';

export async function requestPhoneNotifications() {
  if (isDemoSession()) return;
  if (!isAndroid()) throw new Error('Enable notifications in the Android app.');
  await PushNotifications.createChannel({
    id: 'senik_orders',
    name: 'Senik orders',
    importance: 4,
  });
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    throw new Error('Allow notifications in Android settings, then try again.');
  }
  await PushNotifications.register();
}

export async function disablePhoneNotifications() {
  if (isDemoSession()) return;
  await unregisterCurrentDeviceToken();
  if (isAndroid()) await PushNotifications.unregister();
}
