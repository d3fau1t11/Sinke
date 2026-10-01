import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type RiderProfile = Database['public']['Tables']['riders']['Row'];
type RiderUpdate = Database['public']['Tables']['riders']['Update'];

export function useRiderProfile(riderId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.rider(riderId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select(`
          *,
          rider:riders!inner(id, vehicle_type, vehicle_plate, is_online, current_latitude, current_longitude, rating, total_deliveries)
        `)
        .eq('id', riderId)
        .single();
      if (error) throw error;
      return data as Profile & { rider: RiderProfile };
    },
    enabled: !!riderId
  });
}

export function useMerchantProfile(businessId: string) {
  return useQuery({
    queryKey: queryKeys.profiles.merchant(businessId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('business_staff') as any)
        .select(`
          *,
          profile:profiles!inner(*),
          business:businesses!inner(*)
        `)
        .eq('business_id', businessId);
      if (error) throw error;
      return data;
    },
    enabled: !!businessId
  });
}

export function useUpdateRiderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ riderId, isOnline }: { riderId: string; isOnline: boolean }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase
        .from('riders') as any)
        .update({ is_online: isOnline } as RiderUpdate)
        .eq('id', riderId);
      if (error) throw error;
      return { riderId, isOnline };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.rider(data.riderId) });
    }
  });
}

export function useUpdateRiderLocation() {
  return useMutation({
    mutationFn: async ({ latitude, longitude, heading }: { latitude: number; longitude: number; heading?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).rpc('upsert_rider_location', {
        p_rider_id: user.id,
        p_latitude: latitude,
        p_longitude: longitude,
        p_heading: heading || 0
      });
      if (error) throw error;
    }
  });
}