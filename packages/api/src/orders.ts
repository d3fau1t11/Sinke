import { supabase, asRows, asRow } from './client';
import type { OrderDetail, OrderSummary } from '@senik/types';

export const ordersApi = {
  async create(input: {
    businessId: string;
    items: Array<{
      productId: string;
      quantity: number;
      selectedOptions?: Array<{ id: string; name: string; nameAm: string; price: number }>;
      notes?: string;
    }>;
    deliveryAddress: string;
    deliveryNotes?: string;
    paymentMethod: 'cash' | 'telebirr' | 'cbe_birr';
    idempotencyKey: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('create-order', {
      body: {
        ...input,
        userId: user.id,
      },
    });

    if (error) throw error;
    return data;
  },

  async getMyOrders(): Promise<OrderSummary[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async getById(id: string): Promise<OrderDetail | null> {
    // `profiles` has no `rating`/`vehicle_info` (those live on `riders`) and `businesses` has no
    // `phone` — selecting them made this query fail at runtime. Vehicle/rating display is
    // therefore unavailable until a `riders` embed is added; see RiderSummary in @senik/types.
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image),
        rider:profiles!orders_rider_id_fkey(id, full_name, phone, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return asRow<OrderDetail>(data);
  },
};
