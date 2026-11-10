import type { OrderDetail, OrderStatus } from '@senik/types';
import { demoBusinesses, demoProducts } from './catalog';
import { demoAccounts, DEMO_BUSINESS_ID } from './session';

function order(index: number, status: OrderStatus, assigned = false): OrderDetail {
  const product = demoProducts[index % 4]!;
  const createdAt = new Date(Date.now() - index * 20 * 60_000).toISOString();
  return {
    id: `demo-order-${index}`,
    order_number: `DEMO-${1000 + index}`,
    user_id: demoAccounts.customer.id,
    business_id: DEMO_BUSINESS_ID,
    rider_id: assigned ? demoAccounts.rider.id : null,
    status,
    subtotal: product.price * 2,
    delivery_fee: 40,
    service_fee: 15,
    discount: 0,
    total: product.price * 2 + 55,
    delivery_address: 'Koye Feche, Block 42, Gate 3',
    delivery_notes: 'Sample delivery — call at the gate',
    payment_method: 'cash',
    payment_status: status === 'delivered' ? 'paid' : 'pending',
    promo_code: null,
    idempotency_key: `demo-seed-${index}`,
    created_at: createdAt,
    updated_at: createdAt,
    business: demoBusinesses[0]!,
    rider: assigned ? demoAccounts.rider : null,
    order_items: [
      {
        id: `demo-item-${index}`,
        order_id: `demo-order-${index}`,
        product_id: product.id,
        quantity: 2,
        price: product.price,
        selected_options: null,
        notes: null,
        product,
      },
    ],
  };
}

export function seedDemoOrders(): OrderDetail[] {
  return [
    order(0, 'placed'),
    order(1, 'preparing'),
    order(2, 'ready'),
    order(3, 'ready'),
    order(4, 'delivered', true),
    order(5, 'delivered', true),
    order(6, 'cancelled'),
  ];
}
