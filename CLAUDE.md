# 2 Little Leashes — Project Context

## Overview
Full-stack marketing and booking website for **2 Little Leashes**, a local dog walking and pet care business run by **Meihana** in Rotorua, New Zealand. The site handles public-facing marketing, customer bookings, email automation, and an admin dashboard for managing bookings and verifying payments.

**Live domain:** 2littleleashes.co.nz  
**Deployment target:** Vercel  
**Repository:** github.com/Turei-hub/2littleleashes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (custom design system) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Storage | Supabase Storage (`payment-screenshots` bucket) |
| Email | Nodemailer via Gmail SMTP |
| Fonts | Playfair Display (display), DM Sans (body) |
| Icons | lucide-react |
| Forms | react-hook-form |

---

## Brand

| Token | Value | Usage |
|-------|-------|-------|
| `forest-700` | `#1a3a2a` | Primary dark green — headers, text, buttons |
| `teal` | `#1D9E75` | Accent — CTAs, paid flow, verification badges |
| `amber-500` | `#f59e0b` | Highlight — Book Now CTA, free walk banners |
| `cream` | `#faf8f4` | Page background |

Tailwind config extends `forest` and `cream` as custom colour palettes. Use `bg-forest-700`, `text-forest-600`, `bg-cream`, etc.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page
│   ├── gallery/page.tsx          # Photo gallery
│   ├── about/page.tsx            # About Meihana
│   ├── book/page.tsx             # Booking page (renders BookingForm directly)
│   ├── reviews/page.tsx          # All approved reviews + "Leave a review" form (#leave-review)
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard (protected)
│   │   ├── login/page.tsx        # Admin login
│   │   ├── BookingActions.tsx    # Confirm/Cancel/Verify buttons
│   │   ├── SiteContentEditor.tsx # "Site Content" tab — per-section forms, image upload to site-images
│   │   ├── content-actions.ts    # Server action: upsert site_content rows + revalidatePath('/', 'layout')
│   │   ├── ReviewsManager.tsx    # "Reviews" tab — status filters, Approve/Hide/Delete, Add review form
│   │   ├── review-actions.ts     # Server actions: setReviewStatus / deleteReview / addReview (session client)
│   │   └── LogoutButton.tsx
│   └── api/
│       ├── book/route.ts         # POST — save booking + send emails
│       ├── reviews/route.ts      # POST — public review (honeypot + rate limit) → pending + owner email
│       └── admin/bookings/[id]/route.ts  # PATCH — update status / verify payment
├── components/
│   ├── Navbar.tsx                # Server wrapper — loads banner text via getContent()
│   ├── NavbarClient.tsx          # Sticky nav with Book Now CTA (client component)
│   ├── Footer.tsx                # Footer with subtle Admin link
│   ├── BookingForm.tsx           # Single-page booking form (mirrors the owner's Google Form)
│   ├── AdminFloatingButton.tsx   # Teal float — visible only when logged in
│   ├── BackToTop.tsx             # Fixed scroll-to-top button
│   ├── GalleryCarousel.tsx       # Dog photo carousel/lightbox
│   ├── ReviewCard.tsx            # Public review card + <Stars>
│   ├── ReviewForm.tsx            # Public "Leave a review" form + <StarPicker> (client)
│   └── MarqueeBanner.tsx         # Scrolling info strip below navbar
└── lib/
    ├── content-defaults.ts       # CONTENT_FIELDS — every editable key/label/type/section + fallback value
    ├── content.ts                # getContent() — server-side site_content reader with fallbacks
    ├── data.ts                   # Fixed structure only: policy icons, getPolicies(), DAYS_PER_WEEK_OPTIONS
    ├── reviews.ts                # Review types, REVIEW_LIMITS, validateReviewInput(), getApprovedReviews()
    ├── email.ts                  # All transactional email templates
    ├── supabase.ts               # Anon client (browser-safe)
    └── supabase-server.ts        # SSR + service clients (server only)
```

---

## Key Features

### Public Site
- **Home** — hero with background photo, why-choose-us, reviews (latest 6 approved from the `reviews` table + "See all reviews" / "Leave a review" buttons), policies, final CTA. No standalone services/pricing page — removed 2026-07-04 in favor of driving everyone straight to Book a walk; pricing now only appears inline as checkbox labels on the booking form itself.
- **Gallery** — featured carousel + masonry grid, dog photos in `public/images/`
- **About** — Meihana's story
- **Book** — single-page form (see below)
- **Reviews** (`/reviews`) — every approved review, plus the "Leave a review" form (see below)

### Reviews
Reviews live in the `reviews` table (not `site_content`); only the section eyebrow/heading/subheading are site content (`home.reviews.*`, reused as the `/reviews` hero).
- Public display: `getApprovedReviews(limit?)` in `src/lib/reviews.ts` — approved only, newest first, `sort_order` tie-break. Stars only render when `rating` is set.
- Public form → `POST /api/reviews`: inserts `status='pending'`, `source='website'` via the anon client (**no `.select()`** — anon can't read pending rows). Spam: hidden `website` honeypot (silently returns success) + in-memory per-IP limit (3 per 10 min, per serverless instance). Then `sendNewReviewAlert` (best-effort).
- Limits in `REVIEW_LIMITS`: name ≤ 80, dog name ≤ 80, body 10–1500 (matches the DB check constraint), rating 1–5 or null. `validateReviewInput()` is shared by the form API and the admin Add form.
- Admin changes call `revalidatePath('/', 'layout')` so the homepage/reviews page refresh immediately.

### Editable Site Content (prices & copy)
**Source of truth for all prices and marketing copy is the `site_content` table**, with `src/lib/content-defaults.ts` as the fallback/definition. Never hardcode prices or marketing text in components — add a field instead.

- `CONTENT_FIELDS` in `content-defaults.ts` defines every editable key (label, type `text`/`textarea`/`price`/`image`, section) and its fallback value. It also drives the admin form.
- `getContent()` (`src/lib/content.ts`, server only) returns a key→value object; missing, blank, or non-numeric-price values fall back to the default so the site never shows blanks.
- Pages, `Footer`, `Navbar` (banner) and the root layout's JSON-LD are server components that call `getContent()`. Client components (`BookingForm`, `NavbarClient`, `MarqueeBanner`) receive content as props.
- Service prices: `price.<id>` + `service.<id>` keys; `bookingServices(content)` builds the `$30 - …` labels. The booking form submits service **ids**; `/api/book` resolves labels from `getContent()` so saved bookings and emails always match the displayed prices.
- Weekend surcharge (`price.weekend_surcharge`) is composed into policy 4 and the footer — don't type it into text.
- **Adding a field:** add it to `CONTENT_FIELDS`, use it via `getContent()`, then regenerate/extend `supabase/seed_site_content.sql` (row's `sort_order` = `(index + 1) * 10`).

### Booking Flow (`/book`)
Single-page form — no email-lookup gate, no free/paid branching. Rebuilt 2026-07-04 to mirror the owner's existing Google Form after customers struggled with the old two-step (email check → routed form) flow.

Fields: full name, dog(s) name & breed (combined), email, phone, service selection (checkboxes, multi-select, labels/prices from site content via `bookingServices()`), days per week (radio 1–5 or "Other" with free text), and an optional notes/queries field. Meihana follows up manually by phone/email for meet & greet scheduling and payment — there's no upfront payment screenshot upload or payment reference generation anymore.

### Admin Dashboard (`/admin`)
- Protected by Supabase Auth session (middleware redirects unauthenticated users)
- Booking table: Received, Owner, Dog, Service, Date, Notes, Status, Payment, Actions
- **Status badges:** Pending (amber) / Confirmed (green) / Cancelled (red)
- **Payment badges:** No payment (gray) / Screenshot ↗ (green link) / Verified ✓ (teal)
- **Verify Payment** button: marks `payment_status = 'verified'`, sets `status = 'confirmed'`, fires `sendBookingConfirmed` email
- **View Site →** opens public site in new tab
- **Site Content tab** (`/admin?tab=content`): owner edits copy, prices and hero/about images, grouped by section, one Save per section. Writes use the session client, so `site_content` RLS (`public.is_site_admin()` — milner.turei@gmail.com and 2littleleashes@gmail.com) is enforced; images upload to the public `site-images` bucket (same admin-only write rule)
- **Reviews tab** (`/admin?tab=reviews&status=pending|approved|hidden`): Approve / Hide / Delete, plus an "Add review" form for pasting in Facebook/text reviews (`source` = `facebook` or `admin`, saved as approved). Reads and writes use the session client so `is_site_admin()` RLS applies; update/delete use `.select('id')` to detect RLS silently blocking (0 rows). Shows the note: don't hide honest negative reviews (NZ Fair Trading Act).
- Floating **Admin Dashboard →** teal button appears on public pages when logged in (via `AdminFloatingButton`)

### Email Flows (`src/lib/email.ts`)

| Function | Trigger | Recipient |
|----------|---------|-----------|
| `sendCustomerConfirmation` | On booking submit | Customer |
| `sendOwnerAlert` | On booking submit | Meihana (OWNER_EMAIL) |
| `sendBookingConfirmed` | Admin clicks Verify Payment | Customer |
| `sendWalkReminder` | Manual / scheduler | Customer |
| `sendReviewRequest` | Manual / scheduler | Customer |
| `sendWinBackEmail` | Manual / scheduler | Lapsed customer |
| `sendNewReviewAlert` | On public review submit | OWNER_EMAIL + OWNER_EMAIL_2 |

`sendCustomerConfirmation` and `sendOwnerAlert` no longer branch on booking type — one template covers every booking, listing the selected services and days/week.

---

## Database

### `bookings` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `owner_name` | text | |
| `email` | text | Lowercased on insert |
| `phone` | text | |
| `suburb` | text | **Unused by current form** — legacy column, always null on new rows |
| `dog_name` | text | Holds the combined "dog name + breed" string from the current form |
| `breed` | text | **Unused by current form** — legacy column, always null on new rows |
| `service` | text | `·`-joined list of selected service labels (form allows multi-select) |
| `preferred_date` | text | **Unused by current form** — legacy column, always null on new rows |
| `meet_greet_pref` | text | **Unused by current form** — legacy column, always null on new rows |
| `notes` | text | Prefixed with `Days per week: N`, then the customer's own notes |
| `status` | text | `pending` / `confirmed` / `cancelled` (default: `pending`) |
| `payment_status` | text | `none` / `uploaded` / `verified` (default: `none`) — no longer set by the booking form itself; Meihana manages payment manually |
| `payment_screenshot_url` | text | Supabase Storage public URL — unused since the form dropped the upload step |
| `payment_reference` | text | **Unused by current form** — no longer auto-generated |
| `created_at` | timestamptz | Auto |

**RLS policies:**
- Anon can INSERT (public booking form)
- Authenticated can SELECT all (admin read)
- Authenticated can UPDATE all (admin actions)

**Storage:** `payment-screenshots` bucket (public), anon upload allowed.

### `site_content` table
| Column | Type | Notes |
|--------|------|-------|
| `key` | text | Primary key, e.g. `price.walk_1x`, `home.hero.title` |
| `value` | text | Prices stored as plain numbers (`30`), images as URLs or `/images/...` paths |
| `label` | text | Friendly name shown in admin |
| `type` | text | `text` / `textarea` / `price` / `image` |
| `section` | text | Admin grouping, e.g. `Pricing`, `Home – Hero` |
| `sort_order` | int | Order in admin form |
| `updated_at` | timestamptz | |

**RLS:** public SELECT; INSERT/UPDATE only via `public.is_site_admin()`. Table and `site-images` bucket were created manually in Supabase — don't create or alter them from code.

### `reviews` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `name` | text | Reviewer name |
| `dog_name` | text | Optional |
| `body` | text | Check constraint: 10–1500 chars |
| `rating` | int | 1–5, nullable (the 4 original Facebook reviews have no rating) |
| `status` | text | `pending` / `approved` / `hidden` |
| `source` | text | `website` / `facebook` / `admin` |
| `sort_order` | int | Tie-break after `created_at desc` |
| `created_at` | timestamptz | |

**RLS:** public can SELECT approved; public can INSERT only `status='pending'` + `source='website'`; `public.is_site_admin()` can do everything. Created manually in Supabase — don't create or alter it from code. The old `home.reviews.{1-4}.name/text` site_content keys were retired (copied into this table as approved).

---

## Environment Variables

```env
# Email (Nodemailer / Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=milner.turei@gmail.com
SMTP_PASS=<gmail-app-password>

# Email addresses
OWNER_EMAIL=milner.turei@gmail.com
FROM_EMAIL="2 Little Leashes <milner.turei@gmail.com>"

# Site
NEXT_PUBLIC_SITE_URL=https://2littleleashes.co.nz   # http://localhost:3000 in dev

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nglrjgjzfwopurgzayen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...              # Server only — never expose client-side
```

---

## Admin Access

- **URL:** `/admin/login`
- **Email:** milner.turei@gmail.com
- **Auth:** Supabase Auth (email/password)
- Middleware at `src/middleware.ts` guards all `/admin/*` routes
- Session checked via `@supabase/ssr` cookie-based client

---

## SQL Migrations

Migrations live in `supabase/migrations/` and must be run manually in the Supabase Dashboard SQL editor (Supabase CLI not installed).

| File | Description |
|------|-------------|
| `20260517000000_add_status_and_admin_policies.sql` | Status column + RLS policies |
| `20260517000001_add_payment_system.sql` | Payment columns + storage bucket |
| `20260518000000_add_gallery_submissions.sql` | Gallery submissions table |

`supabase/seed_site_content.sql` seeds `site_content` with the original hardcoded values (re-runnable; never overwrites edited values).

---

## Development

```bash
npm run dev       # Start dev server (localhost:3000)
npx tsc --noEmit  # Type check only
```

> **Rule:** Never run `npm run build` during development. Use `npx tsc --noEmit` for type checking and `npm run dev` for local development. Production builds are handled by Vercel on push.

Images live in `public/images/`. Dog photos are named `dog-photo-1.jpg` through `dog-photo-N.jpg`.

---

## Deployment

Deployed on **Vercel** connected to the GitHub repo. Set all env vars in Vercel dashboard under Project Settings → Environment Variables. `NEXT_PUBLIC_SITE_URL` should be `https://2littleleashes.co.nz` in production.

---

## Mobile Responsiveness

All public pages are mobile-first (375px). Key patterns applied:

- Hero sections: `py-16 sm:py-24 lg:py-28`, headings `text-2xl sm:text-4xl`
- Gallery carousel featured photo: `h-[260px] sm:h-[400px]`
- Booking form service checkboxes stack full-width; days-per-week pills wrap via `flex-wrap`
- CTA buttons: `w-full sm:w-auto` so they stack on small screens
- Admin dashboard: separate mobile card layout (`md:hidden`) and desktop table (`hidden md:block`) — no changes needed
