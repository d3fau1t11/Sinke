import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getPaymentProvider } from '../_shared/payments.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const signature = req.headers.get('X-Chapa-Signature') || req.headers.get('X-Telebirr-Signature');
    if (!signature) {
      return new Response('Missing signature', { status: 401 });
    }

    const body = await req.json();
    const { reference, status, amount } = body;

    if (!reference || !status) {
      return new Response('Missing reference or status', { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find payment by reference
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_reference', reference)
      .single();

    if (paymentError || !payment) {
      return new Response('Payment not found', { status: 404 });
    }

    // Verify with provider
    const provider = getPaymentProvider();
    const verification = await provider.verify({ reference });

    if (verification.status !== 'success') {
      // Update payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', payment.id);

      return new Response('Payment verification failed', { status: 400 });
    }

    // Update payment as completed
    await supabase
      .from('payments')
      .update({
        status: 'completed',
        provider_response: body
      })
      .eq('id', payment.id);

    // Update order as paid
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'placed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.order_id);

    // Create status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: payment.order_id,
        status: 'placed',
        changed_by: null,
        notes: 'Payment confirmed'
      });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Payment webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});