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

    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response('Invalid promo code', { status: 400 });
    }

    const { data: promo, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .single();

    if (error || !promo) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Invalid or expired promo code'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
      return new Response(JSON.stringify({
        valid: false,
        error: 'Promo code usage limit reached'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      valid: true,
      promo: {
        code: promo.code,
        titleAm: promo.title_am,
        titleEn: promo.title_en,
        discountPercent: promo.discount_percent,
        maxDiscount: promo.max_discount,
        minOrder: promo.min_order
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Validate promo error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});