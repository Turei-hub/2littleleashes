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
│   ├── services/page.tsx         # Services & pricing
│   ├── gallery/page.tsx          # Photo gallery
│   ├── about/page.tsx            # About Meihana
│   ├── book/page.tsx             # Booking page (renders BookingForm directly)
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard (protected)
│   │   ├── login/page.tsx        # Admin login
│   │   ├── BookingActions.tsx    # Confirm/Cancel/Verify buttons
│   │   └── LogoutButton.tsx
│   └── api/
│       ├── book/route.ts         # POST — save booking + send emails
│       └── admin/bookings/[id]/route.ts  # PATCH — update status / verify payment
├── components/
│   ├── Navbar.tsx                # Sticky nav with Book Now CTA
│   ├── Footer.tsx                # Footer with subtle Admin link
│   ├── BookingForm.tsx           # Single-page booking form (mirrors the owner's Google Form)
│   ├── AdminFloatingButton.tsx   # Teal float — visible only when logged in
│   ├── BackToTop.tsx             # Fixed scroll-to-top button
│   ├── GalleryCarousel.tsx       # Dog photo carousel/lightbox
│   ├── MarqueeBanner.tsx         # Scrolling info strip below navbar
│   ├── PricingCalculator.tsx     # Interactive price estimator
│   └── ServiceCard.tsx
└── lib/
    ├── data.ts                   # SERVICES, POLICIES, SERVICE_OPTIONS — single source of truth
    ├── email.ts                  # All transactional email templates
    ├── supabase.ts               # Anon client (browser-safe)
    └── supabase-server.ts        # SSR + service clients (server only)
```

---

## Key Features

### Public Site
- **Home** — hero with background photo, stat bar, service cards, reviews (real Facebook reviews), policies, final CTA
- **Services** — full pricing breakdown per service, `PricingCalculator` interactive estimator
- **Gallery** — featured carousel + masonry grid, dog photos in `public/images/`
- **About** — Meihana's story
- **Book** — dual booking flow (see below)

### Booking Flow (`/book`)
Single-page form — no email-lookup gate, no free/paid branching. Rebuilt 2026-07-04 to mirror the owner's existing Google Form after customers struggled with the old two-step (email check → routed form) flow.

Fields: full name, dog(s) name & breed (combined), email, phone, service selection (checkboxes, multi-select from `BOOKING_SERVICES` in `src/lib/data.ts`), days per week (radio 1–5 or "Other" with free text), and an optional notes/queries field. Meihana follows up manually by phone/email for meet & greet scheduling and payment — there's no upfront payment screenshot upload or payment reference generation anymore.

### Admin Dashboard (`/admin`)
- Protected by Supabase Auth session (middleware redirects unauthenticated users)
- Booking table: Received, Owner, Dog, Service, Date, Notes, Status, Payment, Actions
- **Status badges:** Pending (amber) / Confirmed (green) / Cancelled (red)
- **Payment badges:** No payment (gray) / Screenshot ↗ (green link) / Verified ✓ (teal)
- **Verify Payment** button: marks `payment_status = 'verified'`, sets `status = 'confirmed'`, fires `sendBookingConfirmed` email
- **View Site →** opens public site in new tab
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
- Service detail cards: `flex-col` on mobile → `sm:flex-row sm:justify-between`; price `sm:text-right`
- Gallery carousel featured photo: `h-[260px] sm:h-[400px]`
- Booking form pricing grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- CTA buttons: `w-full sm:w-auto` so they stack on small screens
- Admin dashboard: separate mobile card layout (`md:hidden`) and desktop table (`hidden md:block`) — no changes needed

### PricingCalculator controls
- Number of dogs and walks per week use custom `Counter` component (`−` / value / `+` buttons) — no native number inputs
- Weekend visit uses a two-pill toggle (Weekday / Weekend +$20) — no select dropdown
- Both counters default to `0` and have `min={0}`
- Service type select spans full width (`sm:col-span-2`)
