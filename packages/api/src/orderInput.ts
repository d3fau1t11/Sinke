export interface CreateOrderInput {
  businessId: string;
  items: Array<{
    productId: string;
    quantity: number;
    selectedOptions?: Array<{ id: string; name: string; nameAm: string; price: number }>;
    notes?: string;
  }>;
  deliveryAddress: string;
  deliveryNotes?: string;
  paymentMethod: 'cash' | 'telebirr' | 'cbe_birr';
  idempotencyKey: string;
}
