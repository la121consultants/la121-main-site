

## Current State Analysis

**Ebook download after payment:** The PaymentSuccess page at `/payment-success` shows download links for ALL 4 ebooks regardless of which one was purchased. It uses hardcoded static file paths (e.g., `/ebooks/returning-to-work-after-baby.pdf`). There is no verification that payment was actually completed — anyone with the URL could access downloads. The ebooks are also served as static public files, meaning they're accessible without payment.

**Admin Dashboard:** Currently only shows 4 basic stats (pending reviews, active services, draft posts, total ebooks). No tracking of ebook downloads, page visits, or any analytics.

## Plan

### 1. Create analytics tracking tables

Create two new database tables:
- **`page_views`** — tracks page visits with columns: `id`, `page_path`, `page_title`, `referrer`, `user_agent`, `session_id` (anonymous UUID stored in localStorage), `created_at`
- **`ebook_downloads`** — tracks ebook downloads with columns: `id`, `ebook_title`, `stripe_session_id`, `customer_email`, `downloaded_at`, `created_at`

RLS: Public can INSERT (anonymous tracking). Only admins can SELECT.

### 2. Improve PaymentSuccess page — verify payment & show correct ebook

- Create a new edge function **`verify-ebook-payment`** that takes a Stripe `session_id`, calls `stripe.checkout.sessions.retrieve()` to verify payment was completed, and returns the purchased ebook's download URL and title
- Update `PaymentSuccess.tsx` to call this edge function on load, verify the payment, and only show the specific ebook that was purchased (not all 4)
- On successful verification, log the download to `ebook_downloads` table
- Auto-trigger download of the purchased ebook PDF

### 3. Add page view tracking

- Create a `usePageTracking` hook that fires on every route change, inserting a record into `page_views` with the current path, page title, referrer, and an anonymous session ID from localStorage
- Add this hook to `App.tsx` so it runs globally

### 4. Enhance Admin Dashboard with analytics

Update `src/pages/admin/Dashboard.tsx` to show:
- **Total Ebook Downloads** card (count from `ebook_downloads`)
- **Page Views (last 7 days)** card (count from `page_views`)
- **Top Pages** table — showing most visited pages with view counts
- **Recent Ebook Downloads** table — showing recent purchases with ebook title, date, and email
- Keep existing 4 stat cards

### Technical Details

- The `verify-ebook-payment` edge function uses the existing `STRIPE_SECRET_KEY` secret
- Page tracking uses a lightweight localStorage-based anonymous session ID (no auth required)
- The `page_views` table uses anon INSERT policy so tracking works for all visitors
- Download links on PaymentSuccess will point to the ebook's `file_url` from the database rather than hardcoded paths

