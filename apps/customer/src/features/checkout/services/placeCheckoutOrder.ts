import { ordersApi } from '@senik/api';
type CheckoutOrder = Parameters<typeof ordersApi.create>[0];

export async function placeCheckoutOrder(params: CheckoutOrder, phone: string) {
  if (!params.deliveryAddress.trim()) throw new Error('Enter your delivery address.');
  if (!/^(\+251|0)[1-9]\d{8}$/.test(phone.replace(/[\s-]/g, '')))
    throw new Error('Enter a valid Ethiopian phone number.');
  if (!params.businessId || !params.items.length) throw new Error('Your cart is empty.');
  return ordersApi.create(params);
}
