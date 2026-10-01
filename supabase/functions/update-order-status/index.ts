import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ['placed', 'cancelled'],
  placed: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['picked_up', 'cancelled'],
  picked_up: ['on_way', 'cancelled'],
  on_way: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: []
};

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

    const { orderId, status, notes } = await req.json();

    if (!orderId || !status) {
      return new Response('Missing orderId or status', { status: 400 });
    }

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return new Response('Order not found', { status: 404 });
    }

    // Verify user has permission to update this order
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    // Check if user is part of this order
    const isCustomer = order.user_id === user.id;
    const isRider = order.rider_id === user.id;

    if (!isCustomer && !isRider && userRole !== 'admin') {
      // Check if user is merchant staff
      const { data: staff } = await supabase
        .from('business_staff')
        .select('id')
        .eq('business_id', order.business_id)
        .eq('user_id', user.id)
        .single();

      if (!staff) {
        return new Response('Forbidden', { status: 403 });
      }
    }

    // Validate status transition
    const currentStatus = order.status;
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(status)) {
      return new Response(
        `Invalid status transition from ${currentStatus} to ${status}`,
        { status: 400 }
      );
    }

    // Role-specific transition rules
    if (isCustomer && status !== 'cancelled') {
      return new Response('Customers can only cancel orders', { status: 403 });
    }

    if (isRider && !['picked_up', 'on_way', 'delivered'].includes(status)) {
      return new Response('Riders can only update to picked_up, on_way, or delivered', { status: 403 });
    }

    // Update order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      return new Response('Failed to update order', { status: 500 });
    }

    // Create status history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        changed_by: user.id,
        notes: notes || null
      });

    return new Response(JSON.stringify({
      success: true,
      orderId: updatedOrder.id,
      status: updatedOrder.status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});