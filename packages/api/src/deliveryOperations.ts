import { supabase } from './client';
import type { OrderStatus } from '@senik/types';

export async function transitionOrder(orderId: string, status: OrderStatus) {
  const { error } = await supabase.rpc('transition_order' as never, {
    p_order_id: orderId, p_status: status,
  } as never);
  if (error) throw error;
}

export async function claimDelivery(orderId: string) {
  const { error } = await supabase.rpc('claim_delivery' as never, { p_order_id: orderId } as never);
  if (error) throw error;
}
