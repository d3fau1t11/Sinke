import { supabase } from '@senik/api';
import type { UserProfile } from './store/authStore';

export interface SendOtpResult {
  success: boolean;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user: UserProfile | null;
  error?: string;
}

export async function sendOtp(phone: string): Promise<SendOtpResult> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms',
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP';
    return { success: false, error: message };
  }
}

export async function verifyOtp(phone: string, token: string): Promise<VerifyOtpResult> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      return { success: false, user: null, error: error.message };
    }

    if (!data.user) {
      return { success: false, user: null, error: 'Verification failed' };
    }

    const user = await mapUserProfile(data.user.id);

    return { success: true, user };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return { success: false, user: null, error: message };
  }
}

export async function resendOtp(phone: string): Promise<SendOtpResult> {
  return sendOtp(phone);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('profiles') as any)
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      role: data.role,
      zone_id: data.zone_id,
      created_at: data.created_at,
    };
  } catch {
    return null;
  }
}

async function mapUserProfile(userId: string): Promise<UserProfile | null> {
  return getUserProfile(userId);
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) return null;
  return data.session;
}