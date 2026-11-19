-- SECURITY FIX: Paid ebooks were stored as public static files in /public/ebooks/
-- and were freely downloadable without payment. This migration creates a private
-- Supabase Storage bucket and updates ebook file_url records to reference storage
-- paths. The verify-ebook-payment edge function now generates short-lived signed
-- URLs after Stripe payment confirmation instead of returning static file paths.

-- Create private storage bucket (public = false means no direct public URL access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ebooks-private',
  'ebooks-private',
  false,
  52428800,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- No RLS policies that grant anon or authenticated users direct object access.
-- Access is exclusively via service-role-generated signed URLs in the edge function.
-- Signed URLs bypass RLS by design; without a permissive policy, direct storage
-- API calls by browser clients are denied even with an authenticated JWT.

-- Update ebook file_url from static web paths to storage-relative paths.
-- These must match the filenames uploaded to the ebooks-private bucket.
UPDATE public.ebooks
SET file_url = 'returning-to-work-after-baby.pdf'
WHERE title ILIKE '%Returning to Work After Having a Baby%';

UPDATE public.ebooks
SET file_url = 'smart-ways-to-use-ai.pdf'
WHERE title ILIKE '%Smart Ways to Use AI%';

UPDATE public.ebooks
SET file_url = 'side-hustle-success-playbook.pdf'
WHERE title ILIKE '%Side Hustle Success Playbook%';

UPDATE public.ebooks
SET file_url = 'networking-career-success.pdf'
WHERE title ILIKE '%Networking%';
