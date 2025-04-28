import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { stripe } from './stripe.ts';
import { createClient } from 'npm:@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', items.map(item => item.id));

    if (productsError || !products) {
      throw new Error('Products not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) throw new Error(`Product ${item.id} not found`);

        const finalPrice = product.is_discounted 
          ? product.price * (1 - (product.discount || 0) / 100)
          : product.price;

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              images: [product.image],
            },
            unit_amount: Math.round(finalPrice * 100),
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/#/cart`,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'LU', 'CH'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 590, currency: 'eur' },
            display_name: 'Livraison standard',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        }
      ],
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
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