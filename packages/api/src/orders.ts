import { supabase } from './client';

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

  async getMyOrders() {
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
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(id, name_am, name_en, price, image)
        ),
        business:businesses(id, name_am, name_en, avatar_image, phone),
        rider:profiles!orders_rider_id_fkey(id, full_name, phone, avatar_url, rating, vehicle_info)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};