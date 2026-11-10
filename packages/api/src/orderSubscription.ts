import type { Order } from '@senik/types';
import { supabase } from './client';
import { isDemoSession } from './demo/session';
import { readDemoData, subscribeDemoData } from './demo/store';

export function subscribeToOrder(id: string, onUpdate: (order: Order) => void): () => void {
  if (isDemoSession()) {
    return subscribeDemoData(() => {
      const order = readDemoData().orders.find((row) => row.id === id);
      if (order) onUpdate(order);
    });
  }
  const channel = supabase
    .channel(`order-tracking-${id}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
      (payload) => onUpdate(payload.new as Order),
    )
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
