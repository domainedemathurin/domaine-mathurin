import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AnalyticsEvent {
  event: 'pageview' | 'product_view';
  data: {
    path?: string;
    productId?: number;
    sessionId: string;
    userId?: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { event, data }: AnalyticsEvent = await req.json();

    if (event === 'pageview') {
      const { data: pageview, error: pageviewError } = await supabase
        .from('analytics_pageviews')
        .insert([{
          path: data.path,
          session_id: data.sessionId,
          user_id: data.userId,
        }]);

      if (pageviewError) {
        throw pageviewError;
      }

      return new Response(JSON.stringify(pageview), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (event === 'product_view') {
      const { data: productView, error: productViewError } = await supabase
        .from('analytics_product_views')
        .insert([{
          product_id: data.productId,
          session_id: data.sessionId,
          user_id: data.userId,
        }]);

      if (productViewError) {
        throw productViewError;
      }

      return new Response(JSON.stringify(productView), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    throw new Error('Invalid event type');
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});