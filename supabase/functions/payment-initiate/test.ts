import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts';

Deno.test('payment-initiate: rejects non-POST methods', async () => {
  const req = new Request('http://localhost', { method: 'GET' });
  const { default: handler } = await import('./index.ts');
  const res = await handler(req);
  assertEquals(res.status, 405);
});

Deno.test('payment-initiate: rejects unauthorized requests', async () => {
  const req = new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: 'test', paymentMethod: 'telebirr' })
  });

  const { default: handler } = await import('./index.ts');
  const res = await handler(req);
  assertEquals(res.status, 401);
});