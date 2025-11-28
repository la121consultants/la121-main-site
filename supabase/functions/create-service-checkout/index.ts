import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceId, customerEmail } = await req.json();
    
    console.log("Creating service checkout session for:", { serviceId, customerEmail });

    if (!serviceId) {
      throw new Error("Service ID is required");
    }

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get service details
    const { data: service, error: serviceError } = await supabaseClient
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .eq('active', true)
      .single();

    if (serviceError || !service) {
      throw new Error("Service not found or inactive");
    }

    if (!service.stripe_price_id) {
      throw new Error("Service does not have a Stripe price configured");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    let customerId;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      ...(customerId ? { customer: customerId } : {}),
      ...(customerEmail && !customerId ? { customer_email: customerEmail } : {}),
      line_items: [
        {
          price: service.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/#services`,
      metadata: {
        service_id: serviceId,
        service_name: service.name,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
