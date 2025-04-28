import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js';
import Stripe from 'npm:stripe@13.10.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les produits de Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    // Créer ou mettre à jour les produits dans Stripe
    const results = await Promise.all(products.map(async (product) => {
      try {
        // Créer le produit dans Stripe
        const stripeProduct = await stripe.products.create({
          id: `prod_${product.id}`,
          name: product.name,
          description: product.description || undefined,
          images: [product.image],
          metadata: {
            supabase_id: product.id.toString(),
            size: product.size
          },
          active: true,
        });

        // Créer le prix pour le produit
        const finalPrice = product.is_discounted 
          ? product.price * (1 - (product.discount || 0) / 100)
          : product.price;

        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(finalPrice * 100),
          currency: 'eur',
        });

        return {
          success: true,
          productId: product.id,
          stripeProductId: stripeProduct.id,
          stripePriceId: price.id
        };
      } catch (err) {
        console.error('Error syncing product:', err);
        return {
          success: false,
          productId: product.id,
          error: err.message
        };
      }
    }));

    return new Response(
      JSON.stringify(results),
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