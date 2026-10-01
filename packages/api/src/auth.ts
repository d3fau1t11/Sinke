import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Address = Database['public']['Tables']['addresses']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 1000 * 60 * 5
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.auth.profile(userId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId
  });
}

export function useAddresses(userId: string) {
  return useQuery({
    queryKey: queryKeys.auth.addresses(userId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('addresses') as any)
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<ProfileInsert> & { id: string }) => {
      const { id, ...rest } = updates;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('profiles') as any)
        .update(rest as ProfileUpdate)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.profile(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(data.id) });
    }
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: AddressInsert) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('addresses') as any)
        .insert(address as AddressInsert)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.addresses(data.user_id) });
    }
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: AddressUpdate & { id: string }) => {
      const { id, ...rest } = address;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('addresses') as any)
        .update(rest as AddressUpdate)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.addresses(data.user_id) });
    }
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('addresses') as any).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: (_data, _variables) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'addresses'] });
    }
  });
}

export function useSendOTP() {
  return useMutation({
    mutationFn: async (phone: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel: 'sms' }
      });
      if (error) throw error;
    }
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: async ({ phone, token }: { phone: string; token: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      if (error) throw error;
      return data;
    }
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
    }
  });
}