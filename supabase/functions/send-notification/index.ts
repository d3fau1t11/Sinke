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

    const { userId, title, body, data } = await req.json();

    if (!userId || !title || !body) {
      return new Response('Missing userId, title, or body', { status: 400 });
    }

    // Get user's device tokens
    const { data: tokens, error: tokensError } = await supabase
      .from('device_tokens')
      .select('token, platform')
      .eq('user_id', userId);

    if (tokensError || !tokens || tokens.length === 0) {
      return new Response('No device tokens found', { status: 404 });
    }

    // Send notifications via FCM
    const fcmKey = Deno.env.get('FCM_SERVER_KEY');
    if (!fcmKey) {
      return new Response('FCM not configured', { status: 500 });
    }

    const results = [];
    for (const token of tokens) {
      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${fcmKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: token.token,
            notification: {
              title,
              body
            },
            data: data || {},
            priority: 'high'
          })
        });

        const result = await response.json();
        results.push({ token: token.token, success: result.success === 1 });
      } catch (error) {
        results.push({ token: token.token, success: false, error: error.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});