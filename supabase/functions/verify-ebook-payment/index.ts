import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid session_id is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session with line items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not completed", status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 402 }
      );
    }

    // Get the product name from the line items
    const lineItem = session.line_items?.data?.[0];
    const productName = (lineItem?.price?.product as Stripe.Product)?.name || lineItem?.description || "Unknown Ebook";
    const customerEmail = session.customer_details?.email || session.customer_email || "";

    // Look up the ebook in the database by matching the stripe_price_id
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const priceId = lineItem?.price?.id;
    let ebookTitle = productName;
    let fileUrl = "";

    if (priceId) {
      const { data: ebook } = await supabaseClient
        .from("ebooks")
        .select("title, file_url")
        .eq("stripe_price_id", priceId)
        .single();

      if (ebook) {
        ebookTitle = ebook.title;
        fileUrl = ebook.file_url;
      }
    }

    // Log the download
    await supabaseClient.from("ebook_downloads").insert({
      ebook_title: ebookTitle,
      stripe_session_id: sessionId,
      customer_email: customerEmail,
    });

    return new Response(
      JSON.stringify({
        verified: true,
        ebookTitle,
        fileUrl,
        customerEmail,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
