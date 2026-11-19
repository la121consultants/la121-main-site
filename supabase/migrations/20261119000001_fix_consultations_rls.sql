-- SECURITY FIX: Consultations table was publicly readable, exposing customer
-- names, emails, phone numbers, messages, and Zoom meeting links to anyone
-- without authentication. The public SELECT policy existed to allow checking
-- slot availability, but that check is performed server-side in the book-call
-- edge function using the service role key -- no client-side query is needed.

-- Remove the insecure open SELECT policy
DROP POLICY IF EXISTS "Anyone can view consultation schedule" ON public.consultations;

-- Only authenticated admins and super_admins can view consultation records
CREATE POLICY "Admins can view consultations"
  ON public.consultations FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Admins can update consultation records (e.g. cancel, update Zoom link)
CREATE POLICY "Admins can update consultations"
  ON public.consultations FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Admins can delete consultation records
CREATE POLICY "Admins can delete consultations"
  ON public.consultations FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'super_admin'::app_role)
  );
