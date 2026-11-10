import { productsApi } from './products';
import { businessesApi } from './businesses';
import type { CreateOrderInput } from './orderInput';

export async function quoteOrder(input: CreateOrderInput) {
  if (!input.deliveryAddress.trim() || !input.items.length)
    throw new Error('Add items and a delivery address.');
  const business = await businessesApi.getById(input.businessId);
  if (!business?.is_open) throw new Error('This restaurant is closed.');
  const items = await Promise.all(
    input.items.map(async (item) => {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0)
        throw new Error('Quantity must be a positive whole number.');
      const product = await productsApi.getById(item.productId);
      if (!product?.is_available || product.business_id !== business.id)
        throw new Error('A dish is unavailable.');
      const options = (item.selectedOptions ?? []).map((selected) => {
        const option = product.product_options.find((row) => row.id === selected.id);
        if (!option) throw new Error('A selected option is unavailable.');
        return { id: option.id, name: option.name_en, nameAm: option.name_am, price: option.price };
      });
      return {
        product_id: product.id,
        quantity: item.quantity,
        price: product.price + options.reduce((sum, option) => sum + option.price, 0),
        selected_options: options,
        notes: item.notes ?? null,
      };
    }),
  );
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, subtotal, deliveryFee: business.delivery_fee, serviceFee: 15 };
}
