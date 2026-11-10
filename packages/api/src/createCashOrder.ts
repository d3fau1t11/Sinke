import { supabase } from './client';
import type { CreateOrderInput } from './orderInput';
import { normalizeOrderResult } from './orderResult';

const validationMessages = new Set([
  'This restaurant is closed.',
  'A dish is unavailable.',
  'Quantity must be a positive whole number.',
  'A selected option is unavailable.',
  'A required option is missing',
  'Order total is too large',
]);

export async function createCashOrder(input: CreateOrderInput) {
  const { data, error } = await supabase.rpc(
    'create_cash_order' as never,
    { p_input: input } as never,
  );
  if (error) {
    if (error.code === '42501') throw new Error('Sign in to continue.');
    throw new Error(
      validationMessages.has(error.message) ? error.message : 'Something went wrong. Try again.',
    );
  }
  return normalizeOrderResult(data);
}
