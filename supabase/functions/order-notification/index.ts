import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendFirebaseNotification } from '../_shared/fcm.ts';

const statusMessages: Record<string, { am: string; en: string }> = {
  placed: { am: 'አዲስ ትዕዛዝ ተቀምጧል', en: 'A new order has been placed' },
  preparing: { am: 'ምግብዎ በመዘጋጀት ላይ ነው', en: 'Your food is being prepared' },
  ready: { am: 'ትዕዛዝዎ ለመውሰድ ዝግጁ ነው', en: 'Your order is ready for pickup' },
  accepted: { am: 'አድራሽ ተመድቧል', en: 'A rider has been assigned' },
  picked_up: { am: 'ትዕዛዝዎ በመንገድ ላይ ነው', en: 'Your order is on the way' },
  delivered: { am: 'ትዕዛዝዎ ደርሷል', en: 'Your order has been delivered' },
  cancelled: { am: 'ትዕዛዝዎ ተሰርዟል', en: 'Your order was cancelled' },
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const expected = Deno.env.get('ORDER_NOTIFICATION_WEBHOOK_SECRET');
  const provided = request.headers.get('x-senik-webhook-secret');
  if (!expected || provided !== expected) return new Response('Unauthorized', { status: 401 });
  try {
    const event = (await request.json()) as {
      table: string;
      schema: string;
      record: { id: string };
      old_record?: { status?: string };
    };
    if (event.table !== 'orders' || event.schema !== 'public')
      return new Response('Invalid event', { status: 400 });
    const backend = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: order, error } = await backend
      .from('orders')
      .select('*')
      .eq('id', event.record.id)
      .single();
    if (error || !order) return new Response('Order not found', { status: 404 });
    const message = statusMessages[order.status];
    if (!message || event.old_record?.status === order.status)
      return new Response('No status change');
    const { data: staff } = await backend
      .from('business_staff')
      .select('user_id')
      .eq('business_id', order.business_id);
    const recipients = new Set<string>([order.user_id, ...(staff ?? []).map((row) => row.user_id)]);
    if (order.rider_id) recipients.add(order.rider_id);
    const { data: devices, error: devicesError } = await backend
      .from('device_tokens')
      .select('token, language')
      .in('user_id', [...recipients]);
    if (devicesError) throw devicesError;
    await Promise.all(
      (devices ?? []).map((device) =>
        sendFirebaseNotification(
          device.token,
          `${device.language === 'en' ? 'Senik' : 'ስንቅ'} · ${order.order_number}`,
          device.language === 'en' ? message.en : message.am,
          { orderId: order.id },
        ),
      ),
    );
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Notification delivery failed' }, { status: 500 });
  }
});
