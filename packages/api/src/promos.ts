import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type PromoCode = Database['public']['Tables']['promo_codes']['Row'];

export function usePromoCodes() {
  return useQuery({
    queryKey: queryKeys.promos.all(),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('promo_codes') as any)
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PromoCode[];
    }
  });
}

export function useValidatePromoCode(code: string) {
  return useQuery({
    queryKey: queryKeys.promos.validate(code),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).rpc('validate_promo_code', {
        p_code: code,
        p_user_id: (await supabase.auth.getUser()).data.user?.id ?? null
      });
      if (error) throw error;
      return data as { valid: boolean; promo?: PromoCode; error?: string };
    },
    enabled: code.length >= 3
  });
}

export function useApplyPromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.functions.invoke('validate-promo', {
        body: { code }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promos.all() });
    }
  });
}