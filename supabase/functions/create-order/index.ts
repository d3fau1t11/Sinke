import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.22.4';

const OrderItemSchema = z.object({
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

const CreateOrderSchema = z.object({
  businessId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1),
  deliveryAddress: z.string().min(1),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['cash', 'telebirr', 'cbe_birr']),
  promoCode: z.string().optional(),
  idempotencyKey: z.string().min(1)
});

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validated = CreateOrderSchema.parse(body);

    // Check idempotency
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('idempotency_key', validated.idempotencyKey)
      .single();

    if (existingOrder) {
      return new Response(JSON.stringify({ orderId: existingOrder.id }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get business and zone info
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*, zones:zone_id(*)')
      .eq('id', validated.businessId)
      .single();

    if (businessError || !business) {
      return new Response('Business not found', { status: 404 });
    }

    // Calculate prices from database
    let subtotal = 0;
    const orderItems = [];

    for (const item of validated.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*, product_options(*)')
        .eq('id', item.productId)
        .eq('business_id', validated.businessId)
        .single();

      if (productError || !product) {
        return new Response(`Product ${item.productId} not found`, { status: 404 });
      }

      if (!product.is_available) {
        return new Response(`Product ${product.name_en} is not available`, { status: 400 });
      }

      let itemPrice = product.price;

      // Add selected options
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        for (const option of item.selectedOptions) {
          const productOption = product.product_options?.find(
            (po: any) => po.id === option.optionId
          );
          if (productOption) {
            itemPrice += productOption.price;
          }
        }
      }

      subtotal += itemPrice * item.quantity;

      orderItems.push({
        product_id: item.productId,
        quantity: item.quantity,
        price: itemPrice,
        selected_options: item.selectedOptions || null,
        notes: item.notes || null
      });
    }

    // Validate minimum order
    if (subtotal < business.min_order) {
      return new Response(`Minimum order is ${business.min_order} ETB`, { status: 400 });
    }

    // Calculate delivery fee from zone
    const deliveryFee = business.zones?.delivery_fee || business.delivery_fee;
    const serviceFee = 15;

    // Validate and apply promo code
    let discount = 0;
    if (validated.promoCode) {
      const { data: promo, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', validated.promoCode.toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single();

      if (promoError || !promo) {
        return new Response('Invalid promo code', { status: 400 });
      }

      if (subtotal < promo.min_order) {
        return new Response(`Minimum order for this promo is ${promo.min_order} ETB`, { status: 400 });
      }

      if (promo.discount_percent > 0) {
        discount = Math.round((subtotal * promo.discount_percent) / 100);
        if (promo.max_discount && discount > promo.max_discount) {
          discount = promo.max_discount;
        }
      }
    }

    const total = Math.max(0, subtotal + deliveryFee + serviceFee - discount);

    // Generate order number
    const orderNumber = `SNK-${Date.now().toString(36).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        business_id: validated.businessId,
        status: validated.paymentMethod === 'cash' ? 'placed' : 'pending_payment',
        subtotal,
        delivery_fee: deliveryFee,
        service_fee: serviceFee,
        discount,
        total,
        delivery_address: validated.deliveryAddress,
        delivery_notes: validated.deliveryNotes || null,
        payment_method: validated.paymentMethod,
        payment_status: validated.paymentMethod === 'cash' ? 'pending' : 'pending',
        promo_code: validated.promoCode || null,
        idempotency_key: validated.idempotencyKey
      })
      .select()
      .single();

    if (orderError) {
      return new Response('Failed to create order', { status: 500 });
    }

    // Create order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map(item => ({
        ...item,
        order_id: order.id
      })));

    if (itemsError) {
      return new Response('Failed to create order items', { status: 500 });
    }

    // Create status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: order.status,
        changed_by: user.id,
        notes: 'Order created'
      });

    return new Response(JSON.stringify({
      orderId: order.id,
      orderNumber: order.order_number,
      total: order.total,
      status: order.status
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create order error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});