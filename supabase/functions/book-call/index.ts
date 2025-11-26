import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";
import { addMinutes, isAfter, isBefore } from "https://esm.sh/date-fns@3.6.0";
import { availabilityConfig, getWorkingHoursForDate, isDateBlocked } from "../_shared/availability.ts";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v5.9.3/index.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const ZOOM_CLIENT_ID = Deno.env.get("ZOOM_CLIENT_ID");
const ZOOM_CLIENT_SECRET = Deno.env.get("ZOOM_CLIENT_SECRET");
const ZOOM_ACCOUNT_ID = Deno.env.get("ZOOM_ACCOUNT_ID");

const GOOGLE_SERVICE_ACCOUNT_EMAIL = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
const GOOGLE_SERVICE_ACCOUNT_KEY = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
const GOOGLE_CALENDAR_ID = Deno.env.get("GOOGLE_CALENDAR_ID");

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const parsePayload = async (req: Request) => {
  try {
    const body = await req.json();
    const required = ["fullName", "email", "serviceInterest", "startTime", "durationMinutes"];
    for (const field of required) {
      if (!body[field]) {
        return { error: `${field} is required` };
      }
    }
    return { body };
  } catch (error) {
    return { error: `Invalid JSON payload: ${error}` };
  }
};

const hasAvailability = (start: Date, end: Date) => {
  if (isDateBlocked(start, availabilityConfig)) return false;
  const hours = getWorkingHoursForDate(start, availabilityConfig);
  if (!hours) return false;

  const dayStart = new Date(`${start.toISOString().split("T")[0]}T${hours.start}:00Z`);
  const dayEnd = new Date(`${start.toISOString().split("T")[0]}T${hours.end}:00Z`);

  return !isBefore(start, dayStart) && !isAfter(end, dayEnd);
};

const hasConflict = async (start: Date, end: Date) => {
  const { data, error } = await supabase
    .from("consultations")
    .select("id, start_time, end_time")
    .or(
      `and(start_time.lte.${start.toISOString()},end_time.gt.${start.toISOString()}),` +
        `and(start_time.lt.${end.toISOString()},end_time.gte.${end.toISOString()})`
    );

  if (error) throw error;
  return (data || []).length > 0;
};

const createZoomMeeting = async (
  topic: string,
  startTime: string,
  duration: number,
  timeZone: string
): Promise<{ join_url?: string; id?: string }> => {
  if (!ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET || !ZOOM_ACCOUNT_ID) return {};

  const tokenResponse = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
      },
    }
  );

  if (!tokenResponse.ok) {
    console.error("Zoom token error", await tokenResponse.text());
    return {};
  }

  const token = await tokenResponse.json();
  const meetingResponse = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({
      topic,
      type: 2,
      start_time: startTime,
      duration,
      timezone: timeZone,
      settings: {
        join_before_host: true,
      },
    }),
  });

  if (!meetingResponse.ok) {
    console.error("Zoom meeting error", await meetingResponse.text());
    return {};
  }

  return meetingResponse.json();
};

const getGoogleAccessToken = async () => {
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_SERVICE_ACCOUNT_KEY) return null;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const privateKey = GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, "\n");
  const key = await importPKCS8(privateKey, "RS256");
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(key);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    console.error("Google auth error", await response.text());
    return null;
  }

  const data = await response.json();
  return data.access_token as string;
};

const createGoogleEvent = async (
  summary: string,
  description: string,
  startTime: string,
  endTime: string,
  timeZone: string,
  conferenceLink?: string
) => {
  if (!GOOGLE_CALENDAR_ID) return null;

  const accessToken = await getGoogleAccessToken();
  if (!accessToken) return null;

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
        description,
        start: { dateTime: startTime, timeZone },
        end: { dateTime: endTime, timeZone },
        conferenceData: conferenceLink
          ? {
              createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            }
          : undefined,
      }),
    }
  );

  if (!response.ok) {
    console.error("Google event error", await response.text());
    return null;
  }

  return response.json();
};

const sendEmail = async (to: string, subject: string, html: string) => {
  if (!RESEND_API_KEY) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LA121 Consultants <bookings@la121consultants.co.uk>",
      to,
      subject,
      html,
    }),
  });
};

const buildEmailBody = (
  clientName: string,
  service: string,
  start: string,
  end: string,
  timeZone: string,
  zoomLink?: string,
  message?: string,
  phone?: string
) => {
  return `
    <p>Hi ${clientName},</p>
    <p>Your consultation has been booked.</p>
    <p><strong>Service:</strong> ${service}<br/>
    <strong>Start:</strong> ${start} (${timeZone})<br/>
    <strong>End:</strong> ${end} (${timeZone})<br/>
    <strong>Zoom:</strong> ${zoomLink || "Link will follow"}</p>
    <p>${message ? `Notes: ${message}` : ""}</p>
    <p>${phone ? `Phone: ${phone}` : ""}</p>
    <p>Please join 5 minutes early and have your CV ready.</p>
  `;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  const { body, error } = await parsePayload(req);
  if (error) return new Response(JSON.stringify({ error }), { status: 400 });

  const startTime = new Date(body.startTime);
  const endTime = addMinutes(startTime, body.durationMinutes);
  const timeZone = body.timeZone || availabilityConfig.timeZone;

  if (!hasAvailability(startTime, endTime)) {
    return new Response(JSON.stringify({ error: "Selected slot is outside working hours or blocked" }), { status: 400 });
  }

  try {
    const conflict = await hasConflict(startTime, endTime);
    if (conflict) {
      return new Response(JSON.stringify({ error: "This time is no longer available" }), { status: 409 });
    }

    const zoom = await createZoomMeeting(
      `LA121 Consultation – ${body.fullName}`,
      startTime.toISOString(),
      body.durationMinutes,
      timeZone
    );

    const description = `Client: ${body.fullName}\nEmail: ${body.email}\nService: ${body.serviceInterest}\nMessage: ${body.message || "N/A"}\nPhone: ${body.phone || "N/A"}\nZoom: ${zoom.join_url || "Pending"}`;
    const googleEvent = await createGoogleEvent(
      `LA121 Consultation – ${body.fullName}`,
      description,
      startTime.toISOString(),
      endTime.toISOString(),
      timeZone,
      zoom.join_url
    );

    const { data, error: insertError } = await supabase
      .from("consultations")
      .insert({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        service_interest: body.serviceInterest,
        message: body.message,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        time_zone: timeZone,
        duration_minutes: body.durationMinutes,
        zoom_join_url: zoom.join_url,
        zoom_meeting_id: zoom.id?.toString(),
        google_event_id: googleEvent?.id,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const emailBody = buildEmailBody(
      body.fullName,
      body.serviceInterest,
      startTime.toLocaleString("en-GB", { timeZone }),
      endTime.toLocaleString("en-GB", { timeZone }),
      timeZone,
      zoom.join_url,
      body.message,
      body.phone
    );

    await Promise.all([
      sendEmail(body.email, "LA121 Consultation Confirmation", emailBody),
      sendEmail(
        "admin@la121consultants.co.uk",
        `New consultation: ${body.fullName}`,
        emailBody
      ),
    ]);

    return new Response(
      JSON.stringify({
        data,
        zoomLink: zoom.join_url,
        googleEventId: googleEvent?.id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Booking error", err);
    return new Response(JSON.stringify({ error: "Unable to complete booking. Please try another slot." }), {
      status: 500,
    });
  }
});
