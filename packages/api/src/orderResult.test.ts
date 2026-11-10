import { describe, it, expect } from 'vitest';
import { normalizeOrderResult } from './orderResult';

describe('order service response', () => {
  it('normalizes the deployed edge function response so checkout navigates to an order ID', () => {
    expect(normalizeOrderResult({ orderId: 'order-123', orderNumber: 'SNK-123' })).toEqual({
      id: 'order-123',
      order_number: 'SNK-123',
    });
  });
  it('accepts an idempotent retry response with only an order ID', () => {
    expect(normalizeOrderResult({ orderId: 'order-123' }).id).toBe('order-123');
  });
  it('keeps a direct response compatible', () => {
    expect(normalizeOrderResult({ id: 'order-123', order_number: 'SNK-123' })).toEqual({
      id: 'order-123',
      order_number: 'SNK-123',
    });
  });
  it.each([null, {}, { orderId: '' }])(
    'rejects a response that would navigate to undefined',
    (value) => {
      expect(() => normalizeOrderResult(value)).toThrow();
    },
  );
});
