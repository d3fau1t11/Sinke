import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './client';
import { queryKeys } from './queryKeys';
import type { Database } from '@senik/types';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];
type MessageUpdate = Database['public']['Tables']['messages']['Update'];

export function useMessages(orderId: string) {
  return useQuery({
    queryKey: queryKeys.chat.messages(orderId),
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('messages') as any)
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as (Message & { sender: { id: string; full_name: string; avatar_url: string } })[];
    },
    enabled: !!orderId
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, content, type = 'text' }: { orderId: string; content: string; type?: 'text' | 'image' | 'location' }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase
        .from('messages') as any)
        .insert({
          order_id: orderId,
          content,
          type
        } as MessageInsert)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(data.order_id) });
    }
  });
}

export function useSubscribeToMessages(orderId: string) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`messages-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `order_id=eq.${orderId}`
        },
        (payload) => {
          queryClient.setQueryData(queryKeys.chat.messages(orderId), (old: any[] = []) => [
            ...old,
            payload.new
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  return useMessages(orderId);
}

export function useMarkMessagesRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase
        .from('messages') as any)
        .update({ is_read: true } as MessageUpdate)
        .eq('order_id', orderId)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.messages(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.unreadCount() });
    }
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: queryKeys.chat.unreadCount(),
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await (supabase
        .from('messages') as any)
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.user.id);
      if (error) throw error;
      return count || 0;
    }
  });
}