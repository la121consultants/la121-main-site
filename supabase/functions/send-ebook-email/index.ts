import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EbookEmailRequest {
  name: string;
  email: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EbookEmailRequest = await req.json();

    console.log("Sending free ebook lead email:", data);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LA121 Consultants <onboarding@resend.dev>",
        to: ["admin@la121consultants.co.uk"],
        subject: `New Free Ebook Download — ${data.name}`,
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
            <tr>
              <td style="padding:8px 12px;background:#f9fafb;font-weight:600;border:1px solid #e5e7eb;">Phone</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">
                <a href="tel:${data.phone}">${data.phone}</a>
              </td>
            </tr>
          </table>

          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="color:#6b7280;font-size:12px;">
            This notification was sent automatically from the LA121 Consultants website free ebook banner.
          </p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-ebook-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
