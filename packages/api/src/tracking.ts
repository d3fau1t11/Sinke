import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type Order = Database['public']['Tables']['orders']['Row'];
type RiderLocation = Database['public']['Tables']['rider_locations']['Row'];

export function useOrderTracking(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.tracking(orderId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('orders') as any)
        .select(`
          *,
          order_items(
            *,
            product:products(id, name_am, name_en, price)
          ),
          business:businesses(id, name_am, name_en, avatar_image, latitude, longitude),
          rider:profiles!orders_rider_id_fkey(id, full_name, phone, avatar_url, rating, vehicle_info),
          rider_location:rider_locations!rider_locations_rider_id_fkey(id, latitude, longitude, heading, updated_at)
        `)
        .eq('id', orderId)
        .single();
      if (error) throw error;
      return data as Order & {
        order_items: Array<{ product: { id: string; name_am: string; name_en: string; price: number }; quantity: number; price: number }>;
        business: { id: string; name_am: string; name_en: string; avatar_image: string; latitude: number; longitude: number };
        rider: { id: string; full_name: string; phone: string; avatar_url: string; rating: number; vehicle_info: string } | null;
        rider_location: RiderLocation | null;
      };
    },
    enabled: !!orderId,
    refetchInterval: 10000
  });
}

export function useSubscribeToOrderTracking(orderId: string) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          queryClient.setQueryData(queryKeys.orders.tracking(orderId), (old: any) => ({
            ...old,
            ...payload.new
          }));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rider_locations',
          filter: `rider_id=eq.${orderId}`
        },
        (payload) => {
          queryClient.setQueryData(queryKeys.orders.tracking(orderId), (old: any) => ({
            ...old,
            rider_location: payload.new
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  return useOrderTracking(orderId);
}

export function useUpdateRiderLocation() {
  return useMutation({
    mutationFn: async (location: { latitude: number; longitude: number; heading?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).rpc('upsert_rider_location', {
        p_rider_id: user.id,
        p_latitude: location.latitude,
        p_longitude: location.longitude,
        p_heading: location.heading || 0
      });
      if (error) throw error;
    }
  });
}

export function useNearbyRiders(latitude: number, longitude: number, radiusKm = 5) {
  return useQuery({
    queryKey: ['riders', 'nearby', latitude, longitude, radiusKm],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).rpc('get_nearby_riders', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius_km: radiusKm
      });
      if (error) throw error;
      return data;
    },
    enabled: !!latitude && !!longitude,
    refetchInterval: 30000
  });
}