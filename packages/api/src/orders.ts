import { transitionOrder, claimDelivery } from './deliveryOperations';
import { supabase, asRows, asRow } from './client';
import type { OrderDetail, OrderSummary, OrderStatus } from '@senik/types';
import type { CreateOrderInput } from './orderInput';
import { createCashOrder } from './createCashOrder';
import { getDemoProfile, isDemoSession } from './demo/session';
import { readDemoData } from './demo/store';
import { createDemoOrder, updateDemoOrder, acceptDemoDelivery } from './demo/orders';

const orderSelect = `*, order_items(*, product:products(id, name_am, name_en, price, image)),
  business:businesses(id, name_am, name_en, avatar_image, latitude, longitude),
  customer:profiles!orders_user_id_fkey(id, full_name, phone)`;

export const ordersApi = {
  async create(input: CreateOrderInput): Promise<{ id: string; order_number: string }> {
    if (isDemoSession()) return createDemoOrder(input);
    if (input.paymentMethod !== 'cash')
      throw new Error('Online payment is not available yet. Choose cash on delivery.');
    return createCashOrder(input);
  },

  async getMyOrders(): Promise<OrderSummary[]> {
    if (isDemoSession())
      return readDemoData().orders.filter((row) => row.user_id === getDemoProfile()?.id);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('orders')
      .select(orderSelect)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async getById(id: string): Promise<OrderDetail | null> {
    if (isDemoSession()) return readDemoData().orders.find((row) => row.id === id) ?? null;
    const { data, error } = await supabase
      .from('orders')
      .select(
        `${orderSelect}, rider:profiles!orders_rider_id_fkey(id, full_name, phone, avatar_url)`,
      )
      .eq('id', id)
      .single();
    if (error) throw error;
    return asRow<OrderDetail>(data);
  },

  async getByBusiness(businessId: string): Promise<OrderSummary[]> {
    if (isDemoSession())
      return readDemoData().orders.filter((row) => row.business_id === businessId);
    const { data, error } = await supabase
      .from('orders')
      .select(orderSelect)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    if (isDemoSession()) return updateDemoOrder(id, status);
    await transitionOrder(id, status);
  },

  async getAvailableForRiders(): Promise<OrderSummary[]> {
    if (isDemoSession())
      return readDemoData().orders.filter((row) => row.status === 'ready' && !row.rider_id);
    const { data, error } = await supabase
      .from('orders')
      .select(orderSelect)
      .eq('status', 'ready')
      .is('rider_id', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async acceptDelivery(orderId: string, riderId: string): Promise<void> {
    if (isDemoSession()) return acceptDemoDelivery(orderId, riderId);
    await claimDelivery(orderId);
  },

  async getRiderOrders(riderId: string): Promise<OrderSummary[]> {
    if (isDemoSession()) return readDemoData().orders.filter((row) => row.rider_id === riderId);
    const { data, error } = await supabase
      .from('orders')
      .select(orderSelect)
      .eq('rider_id', riderId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<OrderSummary>(data);
  },

  async getAll(): Promise<OrderSummary[]> {
    if (isDemoSession()) return readDemoData().orders;
    const { data, error } = await supabase
      .from('orders')
      .select(orderSelect)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return asRows<OrderSummary>(data);
  },
};
