import { describe, expect, it } from 'vitest';
import { mapOrderPayment } from './orderTransactions';

const order = {
  id: 'order-1',
  order_number: 'SNK-1001',
  total: 355,
  service_fee: 15,
  payment_method: 'cash' as const,
  payment_status: 'pending' as const,
  status: 'delivered' as const,
  created_at: '2026-11-09T10:00:00Z',
};

describe('order transactions', () => {
  it('does not report delivered but unpaid orders as settled', () => {
    expect(mapOrderPayment(order).status).toBe('pending');
  });
  it('uses the actual order service fee', () => {
    expect(mapOrderPayment({ ...order, payment_status: 'paid' })).toMatchObject({
      amount: 355,
      fee: 15,
      net: 340,
      status: 'completed',
    });
  });
  it('marks cancelled and failed payments as failed', () => {
    expect(mapOrderPayment({ ...order, status: 'cancelled' }).status).toBe('failed');
    expect(mapOrderPayment({ ...order, payment_status: 'failed' }).status).toBe('failed');
  });
});
