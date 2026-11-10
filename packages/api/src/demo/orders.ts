import type { OrderDetail, OrderStatus } from '@senik/types';
import type { CreateOrderInput } from '../orderInput';
import { readDemoData, writeDemoData } from './store';
import { demoAccounts, requireDemoRole } from './session';

export function createDemoOrder(input: CreateOrderInput): { id: string; order_number: string } {
  const profile = requireDemoRole('customer');
  const data = readDemoData();
  const existing = data.orders.find((order) => order.idempotency_key === input.idempotencyKey);
  if (existing) return { id: existing.id, order_number: existing.order_number };
  const business = data.businesses.find((row) => row.id === input.businessId);
  if (!business?.is_open) throw new Error('This restaurant is closed.');
  if (!input.deliveryAddress.trim() || input.items.length === 0)
    throw new Error('Add items and a delivery address.');
  const id = `demo-order-${crypto.randomUUID()}`;
  const orderItems = input.items.map((item) => {
    const product = data.products.find((row) => row.id === item.productId);
    if (!product?.is_available || product.business_id !== business.id)
      throw new Error('A dish is unavailable.');
    if (!Number.isInteger(item.quantity) || item.quantity < 1)
      throw new Error('Quantity must be a positive whole number.');
    if (item.selectedOptions?.length) throw new Error('This demo menu has no paid options.');
    return {
      id: crypto.randomUUID(),
      order_id: id,
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
      selected_options: null,
      notes: item.notes ?? null,
      product,
    };
  });
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const stamp = new Date().toISOString();
  const order: OrderDetail = {
    id,
    order_number: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    user_id: profile.id,
    business_id: business.id,
    rider_id: null,
    status: 'placed',
    subtotal,
    delivery_fee: business.delivery_fee,
    service_fee: 15,
    discount: 0,
    total: subtotal + business.delivery_fee + 15,
    delivery_address: input.deliveryAddress.trim(),
    delivery_notes: input.deliveryNotes ?? null,
    payment_method: input.paymentMethod,
    payment_status: input.paymentMethod === 'cash' ? 'pending' : 'paid',
    promo_code: null,
    idempotency_key: input.idempotencyKey,
    created_at: stamp,
    updated_at: stamp,
    business,
    rider: null,
    order_items: orderItems,
  };
  data.orders.unshift(order);
  writeDemoData(data);
  return { id, order_number: order.order_number };
}

export function updateDemoOrder(id: string, status: OrderStatus): void {
  const profile = requireDemoRole('merchant', 'rider', 'admin');
  const data = readDemoData();
  const order = data.orders.find((row) => row.id === id);
  if (!order) throw new Error('Order not found.');
  if (profile.role === 'rider' && order.rider_id !== profile.id)
    throw new Error('Accept this job first.');
  if (order.status === 'delivered' || order.status === 'cancelled')
    throw new Error('This order is already closed.');
  order.status = status;
  if (status === 'delivered') order.payment_status = 'paid';
  order.updated_at = new Date().toISOString();
  writeDemoData(data);
}

export function acceptDemoDelivery(orderId: string, riderId: string): void {
  const profile = requireDemoRole('rider');
  if (profile.id !== riderId) throw new Error('Use your demo rider account.');
  const data = readDemoData();
  if (
    data.orders.some(
      (order) => order.rider_id === riderId && ['accepted', 'picked_up'].includes(order.status),
    )
  ) {
    throw new Error('Finish your active delivery before accepting another job.');
  }
  const order = data.orders.find((row) => row.id === orderId);
  if (!order || order.status !== 'ready' || order.rider_id)
    throw new Error('This job is no longer available.');
  order.rider_id = riderId;
  order.rider = demoAccounts.rider;
  order.status = 'accepted';
  writeDemoData(data);
}

export function advanceDemoOrder(id: string): void {
  const profile = requireDemoRole('customer');
  const data = readDemoData();
  const order = data.orders.find((row) => row.id === id && row.user_id === profile.id);
  if (!order) throw new Error('Order not found.');
  const stages: OrderStatus[] = [
    'placed',
    'accepted',
    'preparing',
    'ready',
    'picked_up',
    'delivered',
  ];
  const next = stages[stages.indexOf(order.status) + 1];
  if (!next || order.status === 'cancelled')
    throw new Error('This demo delivery is already finished.');
  order.status = next;
  if (next === 'picked_up' || next === 'delivered') {
    order.rider_id = demoAccounts.rider.id;
    order.rider = demoAccounts.rider;
  }
  if (next === 'delivered') order.payment_status = 'paid';
  order.updated_at = new Date().toISOString();
  writeDemoData(data);
}
