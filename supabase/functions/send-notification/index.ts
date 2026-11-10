import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sendFirebaseNotification } from '../_shared/fcm.ts';

Deno.serve(async (request) => {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const bearer = request.headers.get('Authorization');
  if (!bearer) return new Response('Unauthorized', { status: 401 });
  try {
    const backend = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const {
      data: { user },
      error,
    } = await backend.auth.getUser(bearer.replace(/^Bearer /i, ''));
    if (error || !user) return new Response('Unauthorized', { status: 401 });
    const { data: profile } = await backend
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 });
    const payload = (await request.json()) as {
      userId: string;
      title: string;
      body: string;
      data?: Record<string, string>;
    };
    if (!payload.userId || !payload.title || !payload.body)
      return new Response('Missing fields', { status: 400 });
    const { data: tokens, error: tokensError } = await backend
      .from('device_tokens')
      .select('token')
      .eq('user_id', payload.userId);
    if (tokensError) throw tokensError;
    const results = await Promise.allSettled(
      (tokens ?? []).map((device) =>
        sendFirebaseNotification(device.token, payload.title, payload.body, payload.data),
      ),
    );
    const failed = results.filter((result) => result.status === 'rejected').length;
    return Response.json({ success: failed === 0, sent: results.length - failed, failed });
  } catch {
    return Response.json({ error: 'Notification delivery failed' }, { status: 500 });
  }
});
