import { supabase, asRow } from './client';
import type { Profile } from '@senik/types';

export function normalizeEthiopianPhone(phone: string) {
  const compact = phone.replace(/[\s-]/g, '');
  if (!/^(\+251|0)[1-9]\d{8}$/.test(compact)) throw new Error('Enter a valid Ethiopian phone number.');
  return compact.startsWith('0') ? `+251${compact.slice(1)}` : compact;
}

export async function sendCustomerOtp(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizeEthiopianPhone(phone), options: { channel: 'sms' },
  });
  if (error) throw error;
}

export async function readCustomerProfile(id: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  const profile = asRow<Profile>(data);
  if (!profile || profile.role !== 'customer') throw new Error('This account cannot access this app.');
  return profile;
}

export async function verifyCustomerOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalizeEthiopianPhone(phone), token, type: 'sms',
  });
  if (error) throw error;
  if (!data.user) throw new Error('Verification failed. Try again.');
  try {
    const created = await supabase.from('profiles').upsert({
      id: data.user.id, full_name: 'Guest', phone: normalizeEthiopianPhone(phone), role: 'customer',
    } as never, { onConflict: 'id', ignoreDuplicates: true });
    if (created.error) throw created.error;
    const profile = await readCustomerProfile(data.user.id);
    return { profile, session: data.session };
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}
