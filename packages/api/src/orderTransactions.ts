import { supabase, asRows } from './client';
import type { Order } from '@senik/types';
import type { TransactionRecord } from './transactionTypes';

type PaymentOrder = Pick<
  Order,
  | 'id'
  | 'order_number'
  | 'total'
  | 'service_fee'
  | 'payment_method'
  | 'payment_status'
  | 'status'
  | 'created_at'
> & {
  business?: { name_en: string } | null;
  profile?: { full_name: string | null; phone: string | null } | null;
};

export function mapOrderPayment(order: PaymentOrder, demo = false): TransactionRecord {
  return {
    id: `${demo ? 'demo-tx' : 'tx-ord'}-${order.id}`,
    reference: order.order_number,
    orderId: order.id,
    orderNumber: order.order_number,
    type: 'order_payment',
    amount: order.total,
    fee: order.service_fee,
    net: order.total - order.service_fee,
    method: order.payment_method,
    status:
      order.status === 'cancelled' || order.payment_status === 'failed'
        ? 'failed'
        : order.payment_status === 'paid'
          ? 'completed'
          : 'pending',
    partyName: demo
      ? 'Selam Demo'
      : order.profile?.full_name ||
        (order.profile?.phone ? `Customer (${order.profile.phone})` : 'Customer'),
    partyRole: 'Customer',
    notes: demo
      ? 'Sample transaction. No money is transferred.'
      : `Delivery fee included. Merchant: ${order.business?.name_en || 'Store'}`,
    createdAt: order.created_at,
  };
}

export async function fetchOrderTransactions(): Promise<TransactionRecord[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
    id, order_number, total, service_fee, payment_method, payment_status, status, created_at,
    business:businesses(name_en), profile:profiles(full_name, phone)
  `,
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return asRows<PaymentOrder>(data).map((order) => mapOrderPayment(order));
}
