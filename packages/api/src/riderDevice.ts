import { supabase } from './client';
import { isDemoSession } from './demo/session';

export async function publishRiderLocation(location: {
  latitude: number;
  longitude: number;
  heading?: number;
}) {
  if (isDemoSession()) return;
  const { error } = await supabase.rpc(
    'upsert_rider_location' as never,
    {
      p_latitude: location.latitude,
      p_longitude: location.longitude,
      p_heading: location.heading ?? 0,
    } as never,
  );
  if (error) throw error;
}

export async function setRiderAvailability(online: boolean) {
  if (isDemoSession()) return;
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Sign in to continue.');
  const { data, error } = await supabase
    .from('riders')
    .update({ is_online: online } as never)
    .eq('id', user.id)
    .select('id')
    .single();
  if (error) throw error;
  if (!data) throw new Error('Ask your administrator to activate your rider account.');
}
