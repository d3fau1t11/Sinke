import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getPaymentProvider } from '../_shared/payments.ts';

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

    const { orderId, paymentMethod, phoneNumber } = await req.json();

    if (!orderId || !paymentMethod) {
      return new Response('Missing orderId or paymentMethod', { status: 400 });
    }

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return new Response('Order not found', { status: 404 });
    }

    if (order.payment_status === 'paid') {
      return new Response('Order already paid', { status: 400 });
    }

    if (paymentMethod === 'cash') {
      return new Response('Cash on delivery does not require payment initiation', { status: 400 });
    }

    const provider = getPaymentProvider();
    const reference = `PAY-${order.order_number}-${Date.now()}`;

    const result = await provider.initiate({
      amount: order.total,
      currency: 'ETB',
      phone: phoneNumber || user.phone || '',
      reference,
      returnUrl: `${Deno.env.get('SITE_URL')}/payment/verify?orderId=${orderId}`
    });

    // Create payment record
    await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount: order.total,
        method: paymentMethod,
        status: 'pending',
        provider_reference: result.reference
      });

    return new Response(JSON.stringify({
      paymentId: result.reference,
      redirectUrl: result.redirectUrl,
      reference: result.reference
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment initiate error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});