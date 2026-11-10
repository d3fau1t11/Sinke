import {
  supabase,
  sendCustomerOtp,
  verifyCustomerOtp,
  readCustomerProfile,
  signOutStaff,
} from '@senik/api';
import type { UserProfile } from './store/authStore';

export async function sendOtp(phone: string) {
  try {
    await sendCustomerOtp(phone);
    return { success: true };
  } catch {
    return {
      success: false,
      error: 'Could not send a code. Check your phone number and connection.',
    };
  }
}
export async function verifyOtp(
  phone: string,
  token: string,
): Promise<{
  success: boolean;
  user: UserProfile | null;
  error?: string;
}> {
  try {
    const { profile } = await verifyCustomerOtp(phone, token);
    return { success: true, user: profile };
  } catch {
    return { success: false, user: null, error: 'Verification failed. Try again.' };
  }
}
export const resendOtp = sendOtp;
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
export async function getUserProfile(id: string): Promise<UserProfile | null> {
  return readCustomerProfile(id);
}
export const signOut = signOutStaff;
export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session;
}
