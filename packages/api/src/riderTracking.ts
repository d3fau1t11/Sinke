import { useQuery } from '@tanstack/react-query';
import { supabase, asRow } from './client';
import { isDemoSession } from './demo/session';

export type RiderCoordinate = { latitude: number; longitude: number; updated_at: string };

export function useRiderCoordinate(riderId: string | null) {
  return useQuery({
    queryKey: ['rider-coordinate', riderId],
    enabled: Boolean(riderId) && !isDemoSession(),
    refetchInterval: 10000,
    queryFn: async () => {
      const { data, error } = await supabase.from('rider_locations')
        .select('latitude, longitude, updated_at').eq('rider_id', riderId!)
        .order('updated_at', { ascending: false }).limit(1).maybeSingle();
      if (error) throw error;
      return asRow<RiderCoordinate>(data);
    },
  });
}
