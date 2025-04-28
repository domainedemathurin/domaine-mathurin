import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from './stripe.ts';
import { createClient } from 'npm:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new Error('Session not found');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: session.client_reference_id,
        total: session.amount_total ? session.amount_total / 100 : 0,
        stripe_payment_intent_id: session.payment_intent,
        status: 'processing'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Créer les articles de la commande
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    
    const orderItems = lineItems.data.map(item => ({
      order_id: order.id,
      product_id: item.price?.product,
      quantity: item.quantity || 0,
      price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return new Response(
      JSON.stringify({ success: true, orderId: order.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});