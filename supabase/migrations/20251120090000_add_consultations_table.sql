-- Create consultations table for booking requests
CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_interest text NOT NULL,
  message text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  time_zone text NOT NULL DEFAULT 'Europe/London',
  duration_minutes integer NOT NULL DEFAULT 30,
  zoom_join_url text,
  zoom_meeting_id text,
  google_event_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS consultations_unique_start_time ON public.consultations(start_time);
CREATE INDEX IF NOT EXISTS consultations_email_idx ON public.consultations(email);
CREATE INDEX IF NOT EXISTS consultations_start_time_idx ON public.consultations(start_time);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view available slots and create bookings
CREATE POLICY "Anyone can create consultation bookings"
  ON public.consultations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view consultation schedule"
  ON public.consultations FOR SELECT
  USING (true);

CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
