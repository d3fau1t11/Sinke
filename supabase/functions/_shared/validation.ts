import { z } from 'https://esm.sh/zod@3.22.4';

export const phoneSchema = z.string().regex(/^(\+251|0)[1-9]\d{8}$/);

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  selectedOptions: z.array(z.object({
    optionId: z.string().uuid(),
    nameAm: z.string(),
    nameEn: z.string(),
    price: z.number()
  })).optional(),
  notes: z.string().optional()
});

export const createOrderSchema = z.object({
  businessId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1),
  deliveryAddress: z.string().min(1),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['cash', 'telebirr', 'cbe_birr']),
  promoCode: z.string().optional(),
  idempotencyKey: z.string().min(1)
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    'pending_payment', 'placed', 'accepted', 'preparing',
    'ready', 'picked_up', 'delivered', 'cancelled'
  ]),
  notes: z.string().optional()
});

export const assignRiderSchema = z.object({
  orderId: z.string().uuid(),
  riderId: z.string().uuid()
});

export const paymentInitiateSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.enum(['telebirr', 'cbe_birr']),
  phoneNumber: phoneSchema.optional()
});

export const sendNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string()).optional()
});