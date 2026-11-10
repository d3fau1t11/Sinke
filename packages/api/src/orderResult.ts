export function normalizeOrderResult(value: unknown): { id: string; order_number: string } {
  if (!value || typeof value !== 'object')
    throw new Error('The order service returned an invalid response.');
  const result = value as Record<string, unknown>;
  const id = result['id'] ?? result['orderId'];
  const number = result['order_number'] ?? result['orderNumber'];
  if (typeof id !== 'string' || !id)
    throw new Error('The order service did not return an order ID.');
  return { id, order_number: typeof number === 'string' ? number : '' };
}
