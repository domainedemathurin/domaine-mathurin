import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js';
import Stripe from "npm:stripe@13.10.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe('sk_test_51RHs2gQmEzfX99Cua15mAIUci3XMwMbhV1zgeqskZCCgNLoez6GI6jM4Ry5fFAnqQ7Y3usue8SROnWMzKvMPCdk400DLZ64a7T', {
  apiVersion: '2023-10-16',
});

// Clé secrète du webhook Stripe
const webhookSecret = 'whsec_1RHs2gQmEzfX99CuUgyPVihtuTIKLqxx8ytrXAYEv1lN8iLZof2jM0tLMD31ceq9H5RhQ2LsELg66WBLeuP8meEv00t6hdcd7j';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature found');
    }

    const body = await req.text();
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Mettre à jour le statut de la commande
        const { error } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) throw error;
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Mettre à jour le statut de la commande
        const { error } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) throw error;
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});