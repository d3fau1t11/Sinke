import { supabase, asRow } from './client';
import { endDemoSession } from './demo/session';
import type { Database } from '@senik/types';
import { unregisterCurrentDeviceToken } from './deviceTokens';

export type StaffRole = 'merchant_staff' | 'rider' | 'admin';
type Profile = Database['public']['Tables']['profiles']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
export type StaffIdentity = { profile: Profile; business: Business | null; riderOnline?: boolean };

export function hasBackendConfiguration() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export async function signInStaff(email: string, password: string, role: StaffRole) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  try {
    const identity = await getStaffIdentity(role);
    endDemoSession();
    return identity;
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}

export async function getStaffIdentity(role: StaffRole): Promise<StaffIdentity> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sign in to continue.');
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) throw error;
  const profile = asRow<Profile>(data);
  if (!profile || profile.role !== role) throw new Error('This account cannot access this app.');
  let business: Business | null = null;
  if (role === 'merchant_staff') {
    const { data: staff, error: staffError } = await supabase
      .from('business_staff' as never)
      .select('business_id')
      .eq('user_id', user.id)
      .limit(1)
      .single();
    if (staffError) throw staffError;
    const membership = asRow<{ business_id: string }>(staff);
    if (!membership) throw new Error('Ask your administrator to assign your store.');
    const result = await supabase
      .from('businesses')
      .select('*')
      .eq('id', membership.business_id)
      .single();
    if (result.error) throw result.error;
    business = asRow<Business>(result.data);
    if (!business) throw new Error('Ask your administrator to assign your store.');
  }
  if (role === 'rider') {
    const result = await supabase.from('riders').select('is_online').eq('id', profile.id).single();
    if (result.error) throw result.error;
    const rider = asRow<{ is_online: boolean }>(result.data);
    if (!rider) throw new Error('Ask your administrator to activate your rider account.');
    return { profile, business, riderOnline: rider.is_online };
  }
  return { profile, business };
}

export async function signOutStaff() {
  await unregisterCurrentDeviceToken();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
