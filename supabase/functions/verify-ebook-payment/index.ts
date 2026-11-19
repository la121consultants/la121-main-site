import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Signed URL validity window: 2 hours is enough to complete the download
// but short enough to prevent long-lived link sharing
const SIGNED_URL_EXPIRY_SECONDS = 7200;

const EBOOKS_BUCKET = "ebooks-private";

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

    // Retrieve and verify the Stripe checkout session directly from Stripe —
    // never trust payment status from the frontend
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not completed", status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 402 }
      );
    }

    // Use service role key — bypasses RLS for server-side operations only
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const lineItem = session.line_items?.data?.[0];
    const productName =
      (lineItem?.price?.product as Stripe.Product)?.name ||
      lineItem?.description ||
      "Unknown Ebook";
    const customerEmail =
      session.customer_details?.email || session.customer_email || "";
    const priceId = lineItem?.price?.id;

    let ebookTitle = productName;
    let storagePath = "";

    if (priceId) {
      const { data: ebook } = await supabaseClient
        .from("ebooks")
        .select("title, file_url")
        .eq("stripe_price_id", priceId)
        .single();

      if (ebook) {
        ebookTitle = ebook.title;
        storagePath = ebook.file_url;
      }
    }

    if (!storagePath) {
      console.error("No storage path found for priceId:", priceId);
      return new Response(
        JSON.stringify({ error: "Ebook file not found. Please contact support." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Generate a short-lived signed URL — payment is verified server-side by Stripe,
    // so only paying customers reach this point. The signed URL expires after
    // SIGNED_URL_EXPIRY_SECONDS so it cannot be shared for long-term free access.
    const { data: signedData, error: signedError } = await supabaseClient.storage
      .from(EBOOKS_BUCKET)
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS, {
        download: `${ebookTitle}.pdf`,
      });

    if (signedError || !signedData?.signedUrl) {
      console.error("Failed to generate signed URL:", signedError);
      return new Response(
        JSON.stringify({ error: "Unable to generate download link. Please contact support." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Log the download for admin reporting
    await supabaseClient.from("ebook_downloads").insert({
      ebook_title: ebookTitle,
      stripe_session_id: sessionId,
      customer_email: customerEmail,
    });

    return new Response(
      JSON.stringify({
        verified: true,
        ebookTitle,
        fileUrl: signedData.signedUrl,
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
