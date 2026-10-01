import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type Payment = Database['public']['Tables']['payments']['Row'];

export interface InitiatePaymentInput {
  orderId: string;
  amount: number;
  paymentMethod: 'cash' | 'telebirr' | 'cbe_birr';
  phoneNumber?: string;
  returnUrl?: string;
}

export interface PaymentResult {
  paymentId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  redirectUrl?: string;
  reference?: string;
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.payments.methods(),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('payment_methods') as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    }
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.payments.history(),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('payments') as any)
        .select(`
          *,
          order:orders(id, order_number, total, status)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as (Payment & { order: { id: string; order_number: string; total: number; status: string } })[];
    }
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: async (input: InitiatePaymentInput): Promise<PaymentResult> => {
      const { data, error } = await supabase.functions.invoke('payment-initiate', {
        body: input
      });
      if (error) throw error;
      return data as PaymentResult;
    }
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentId, providerReference }: { paymentId: string; providerReference: string }) => {
      const { data, error } = await supabase.functions.invoke('payment-verify', {
        body: { paymentId, providerReference }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.history() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
    }
  });
}

export function useCashOnDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, amountCollected }: { orderId: string; amountCollected: number }) => {
      const { error } = await supabase.functions.invoke('payment-cod', {
        body: { orderId, amountCollected }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.history() });
    }
  });
}