import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Verify user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response('Forbidden', { status: 403 });
    }

    const { orderId, riderId } = await req.json();

    if (!orderId || !riderId) {
      return new Response('Missing orderId or riderId', { status: 400 });
    }

    // Verify rider exists and is online
    const { data: rider, error: riderError } = await supabase
      .from('riders')
      .select('*')
      .eq('id', riderId)
      .eq('is_online', true)
      .single();

    if (riderError || !rider) {
      return new Response('Rider not found or offline', { status: 404 });
    }

    // Update order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        rider_id: riderId,
        status: 'rider_assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (orderError) {
      return new Response('Failed to assign rider', { status: 500 });
    }

    // Create status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: 'rider_assigned',
        changed_by: user.id,
        notes: `Rider ${riderId} assigned`
      });

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      riderId: rider.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Assign rider error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});