import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EbookEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EbookEmailRequest = await req.json();

    if (!data.email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Save lead to DB using service role (bypasses RLS)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Find or create a profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      let profileId = existingProfile?.id;

      if (!profileId) {
        const { data: newProfile, error: profileError } = await supabase
          .from("profiles")
          .insert({
            full_name: data.name || data.email,
            email: data.email,
            how_found_us: "Free Ebook Banner",
          })
          .select()
          .single();

        if (!profileError && newProfile) {
          profileId = newProfile.id;
        } else {
          console.error("Profile insert error:", profileError);
        }
      }

      if (profileId) {
        const { error: submissionError } = await supabase
          .from("form_submissions")
          .insert({
            profile_id: profileId,
            form_type: "free_ebook_international",
            additional_notes: `Free ebook download\nName: ${data.name}\nEmail: ${data.email}`,
            status: "new",
          });

        if (submissionError) {
          console.error("Submission insert error:", submissionError);
        }
      }
    }

    // Send email notification
    if (RESEND_API_KEY) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "LA121 Consultants <onboarding@resend.dev>",
          to: ["admin@la121consultants.co.uk"],
          subject: `New Free Ebook Download — ${data.name || data.email}`,
          html: `
            <h1 style="color:#dc2626;">New Free Ebook Lead — International Student</h1>
            <p>A new international student has downloaded the free career guide.</p>
            <table style="border-collapse:collapse;width:100%;max-width:480px;margin-top:16px;">
              <tr>
                <td style="padding:8px 12px;background:#f9fafb;font-weight:600;border:1px solid #e5e7eb;width:120px;">Name</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f9fafb;font-weight:600;border:1px solid #e5e7eb;">Email</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;">
                  <a href="mailto:${data.email}">${data.email}</a>
                </td>
              </tr>
            </table>
            <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
            <p style="color:#6b7280;font-size:12px;">
              Sent automatically from the LA121 Consultants free ebook banner.
            </p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const err = await emailResponse.json();
        console.error("Resend error:", err);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-ebook-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
