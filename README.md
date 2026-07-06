# 2 Little Leashes — Website & Automation

Full Next.js 14 rebuild of **2littleleashes.co.nz** with built-in email automation.

---

## Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Framework   | Next.js 14 (App Router)       |
| Language    | TypeScript                    |
| Styling     | Tailwind CSS (custom tokens)  |
| Forms       | React Hook Form               |
| Email       | Nodemailer (Gmail SMTP)       |
| Icons       | Lucide React                  |
| Hosting     | Vercel (recommended)          |

---

## Project structure

```
src/
├── app/
│   ├── api/book/route.ts     # POST endpoint — validates + fires emails
│   ├── page.tsx              # Home page
│   ├── book/page.tsx         # Booking page
│   ├── about/page.tsx        # About Meihana
│   ├── layout.tsx            # Root layout, fonts, metadata
│   └── globals.css           # Tailwind + component classes
├── components/
│   ├── Navbar.tsx            # Sticky nav, mobile hamburger
│   ├── Footer.tsx            # Footer with links and hours
│   └── BookingForm.tsx       # Single-page booking form
└── lib/
    ├── data.ts               # All services, policies, pricing (edit here)
    └── email.ts              # All email templates (5 flows)
```

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password        # NOT your Gmail password — see below
OWNER_EMAIL=meihana@2littleleashes.co.nz
FROM_EMAIL="2 Little Leashes <meihana@2littleleashes.co.nz>"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Getting a Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already on
3. Search for **App Passwords** at the top
4. Create one for "Mail" → "Other (custom)" → name it "2 Little Leashes"
5. Copy the 16-character password into `SMTP_PASS`

### 3. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Email automation flows

All flows live in `src/lib/email.ts`. Five templates are included:

| Function                   | Trigger                         | Who receives it            |
|----------------------------|---------------------------------|----------------------------|
| `sendCustomerConfirmation` | Booking form submitted          | Customer                   |
| `sendOwnerAlert`           | Booking form submitted          | Meihana (owner inbox)      |
| `sendWalkReminder`         | 24h before a scheduled walk     | Customer                   |
| `sendReviewRequest`        | 2–3h after a walk completes     | Customer                   |
| `sendWinBackEmail`         | 30 days since last booking      | Lapsed customer            |

### Flows 1 & 2 are automatic
These fire immediately when someone submits the booking form — no setup needed beyond the SMTP credentials.

### Flows 3, 4 & 5 — scheduling options

**Option A: Zapier (no code, free tier)**
- Trigger: Google Sheets row added (when a walk is confirmed)
- Action: Delay → send via Gmail

**Option B: Vercel Cron Jobs**

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/walk-reminders",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/review-requests",
      "schedule": "0 14 * * *"
    },
    {
      "path": "/api/cron/win-back",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

Then create `/api/cron/walk-reminders/route.ts` etc. to query a database of upcoming walks and fire `sendWalkReminder`.

**Option C: Acuity Scheduling ($16/mo)**
Handles booking calendar + auto-reminders built in. Use this if you want a full scheduling UI without building one.

---

## Updating content

All services, pricing, and policies are in **one file**: `src/lib/data.ts`

Edit prices, features, or add services there and every page updates automatically. No hunting through multiple files.

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Set all `.env.local` values in Vercel Dashboard → Project → Settings → Environment Variables.

Update `NEXT_PUBLIC_SITE_URL` to your live domain, e.g. `https://2littleleashes.co.nz`.

### Custom domain

In Vercel Dashboard → Domains → add `2littleleashes.co.nz`.
Point your DNS A record to Vercel's IP (shown in dashboard).

---

## Google Review link

In `src/lib/email.ts`, find `sendReviewRequest` and replace:

```ts
const reviewUrl = data.googleReviewUrl || 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review'
```

Get your Place ID from: https://developers.google.com/maps/documentation/places/web-service/place-id

---

## Accessibility notes

- All form fields have proper `id`/`htmlFor` associations
- Focus rings use the amber brand colour
- Colour contrast meets WCAG AA (dark forest text on cream backgrounds)
- Mobile hamburger menu included in Navbar

---

## Recommended next additions

1. **Booking calendar** — integrate Acuity or Cal.com for Meihana to manage availability
2. **Client portal** — simple Supabase table storing dog profiles + walk history
3. **Photo gallery** — Instagram embed or Cloudinary for walk photos
4. **SMS reminders** — Twilio integration alongside email (swap into `sendWalkReminder`)
5. **Google Analytics** — add `@next/third-parties` for GA4
