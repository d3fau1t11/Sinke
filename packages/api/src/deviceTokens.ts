import { supabase } from './client';
import { isDemoSession } from './demo/session';

const storageKey = 'senik-device-notification-token';
export const getRegisteredDeviceToken = () =>
  typeof localStorage === 'undefined' ? null : localStorage.getItem(storageKey);

export async function registerDeviceToken(token: string, language: 'am' | 'en' = 'am') {
  if (isDemoSession()) return;
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sign in before enabling notifications.');
  const { error } = await supabase
    .from('device_tokens')
    .upsert({ user_id: user.id, token, platform: 'android', language } as never, {
      onConflict: 'user_id,token',
    });
  if (error) throw error;
  if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, token);
}

export async function unregisterDeviceToken(token: string) {
  if (isDemoSession()) return;
  const { error } = await supabase.from('device_tokens').delete().eq('token', token);
  if (error) throw error;
  if (typeof localStorage !== 'undefined') localStorage.removeItem(storageKey);
}

export async function unregisterCurrentDeviceToken() {
  const token = getRegisteredDeviceToken();
  if (token) await unregisterDeviceToken(token);
}
