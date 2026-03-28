
-- Create page_views table
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (anonymous tracking)
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only admins can view page views
CREATE POLICY "Admins can view page views" ON public.page_views
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Create ebook_downloads table
CREATE TABLE public.ebook_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_title text NOT NULL,
  stripe_session_id text,
  customer_email text,
  downloaded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ebook_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert ebook downloads (logged from edge function or client)
CREATE POLICY "Anyone can insert ebook downloads" ON public.ebook_downloads
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only admins can view ebook downloads
CREATE POLICY "Admins can view ebook downloads" ON public.ebook_downloads
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
