import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PartnershipEmailRequest {
  fullName: string;
  email: string;
  companyName: string;
  partnershipTier: string;
  selectedServices: string[];
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PartnershipEmailRequest = await req.json();

    console.log("Sending partnership enquiry email:", data);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "LA121 Consultants <notifications@la121consultants.co.uk>",
        to: ["admin@la121consultants.co.uk"],
        subject: `New Partnership Enquiry from ${data.companyName}`,
        html: `
          <h1>New Partnership Enquiry</h1>
          <h2>Contact Information</h2>
          <p><strong>Name:</strong> ${data.fullName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
          
          <h2>Partnership Details</h2>
          <p><strong>Partnership Tier:</strong> ${data.partnershipTier}</p>
          
          <h2>Selected Services</h2>
          <ul>
            ${data.selectedServices.map(service => `<li>${service}</li>`).join('')}
          </ul>
          
          ${data.additionalInfo ? `
            <h2>Additional Information</h2>
            <p>${data.additionalInfo}</p>
          ` : ''}
          
          <hr style="margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This email was sent from the LA121 Consultants partnership form.
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
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-partnership-email function:", error);
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
