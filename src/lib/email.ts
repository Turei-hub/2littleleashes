// src/lib/email.ts
// Handles all transactional emails via Nodemailer (Gmail SMTP).
// Called by the /api/book route.

import nodemailer from 'nodemailer'

export interface BookingData {
  ownerName: string
  email: string
  phone: string
  suburb: string
  dogName: string
  breed: string
  service: string
  preferredDate: string
  meetGreetPref: string
  notes: string
  paymentRef: string
  bookingType: 'free' | 'paid'
}

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST    || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// ─── Shared design system ─────────────────────────────────────────────────────

const SHARED_CSS = `
  body{margin:0;padding:0;background:#faf8f4;font-family:'Helvetica Neue',Arial,sans-serif;color:#1c2b22;-webkit-text-size-adjust:100%;}
  img{border:0;display:block;outline:none;}
  .wrapper{padding:32px 16px;}
  .card{background:#ffffff;border-radius:14px;max-width:560px;margin:0 auto;overflow:hidden;border:1px solid #e0ddd6;box-shadow:0 2px 16px rgba(26,58,42,0.07);}
  .logo-section{background:#ffffff;padding:26px 32px 20px;text-align:center;border-bottom:2px solid #1a3a2a;}
  .logo-section img{width:80px;height:80px;border-radius:50%;margin:0 auto 10px;border:3px solid #e8f2ec;object-fit:cover;}
  .brand-name{font-size:18px;font-weight:700;color:#1a3a2a;letter-spacing:0.2px;text-decoration:none;display:block;margin-bottom:3px;}
  .brand-sub{font-size:11px;color:#a0b0a5;letter-spacing:1.3px;text-transform:uppercase;margin:0;}
  .email-header{padding:24px 32px;}
  .email-header h1{margin:0 0 4px;font-size:21px;color:#ffffff;line-height:1.25;}
  .email-header p{margin:0;font-size:13px;color:rgba(255,255,255,0.65);}
  .body{padding:28px 32px;}
  .greeting{font-size:16px;font-weight:600;color:#1a3a2a;margin:0 0 10px;}
  .intro{font-size:14px;color:#5a7060;line-height:1.65;margin:0 0 20px;}
  .detail-box{background:#f3f8f5;border:1px solid #cfe4d7;border-radius:10px;padding:18px 22px;margin:20px 0;}
  .detail-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#7a9080;margin:0 0 14px;}
  .detail-row{display:flex;justify-content:space-between;align-items:baseline;padding:7px 0;font-size:13px;border-bottom:1px solid rgba(26,58,42,0.07);}
  .detail-row:last-child{border-bottom:none;}
  .dl{color:#7a9080;}
  .dv{font-weight:600;color:#1a3a2a;}
  .steps-title{font-size:13px;font-weight:700;color:#1a3a2a;margin:24px 0 12px;}
  .step{display:flex;gap:12px;margin-bottom:12px;align-items:flex-start;}
  .step-num{background:#1a3a2a;color:#fff;min-width:26px;width:26px;height:26px;border-radius:50%;text-align:center;line-height:26px;font-size:12px;font-weight:700;flex-shrink:0;}
  .step-text{font-size:13px;color:#5a7060;line-height:1.55;padding-top:4px;}
  .callout-amber{background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #d97706;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:13px;color:#92400e;line-height:1.6;}
  .callout-teal{background:#e8f8f4;border:1px solid #a7dece;border-left:4px solid #1D9E75;border-radius:10px;padding:18px 22px;margin:20px 0;}
  .ct-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1D9E75;margin:0 0 14px;}
  .ct-row{display:flex;justify-content:space-between;align-items:baseline;padding:6px 0;font-size:13px;border-bottom:1px solid rgba(29,158,117,0.12);}
  .ct-row:last-child{border-bottom:none;}
  .ctl{color:#2d8a6a;}
  .ctv{font-weight:700;color:#145a40;}
  .ct-ref{font-weight:700;font-size:15px;color:#145a40;letter-spacing:1px;}
  .ct-note{font-size:12px;color:#2d8a6a;margin:10px 0 0;}
  .footer{background:#f0ede6;border-top:1px solid #e0ddd6;padding:20px 32px;text-align:center;font-size:12px;color:#93a89a;line-height:1.8;}
  .footer a{color:#1a3a2a;font-weight:700;text-decoration:none;}
  .btn{display:inline-block;padding:13px 30px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;}
  .btn-amber{background:#d97706;color:#ffffff;}
  .btn-forest{background:#1a3a2a;color:#ffffff;}
  @media(max-width:600px){.wrapper{padding:12px 8px;}.logo-section,.email-header,.body,.footer{padding-left:20px;padding-right:20px;}}
`

function logoSection(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || ''
  return `
    <div class="logo-section">
      <a href="${url}" style="text-decoration:none;">
        <img src="https://2littleleashes.vercel.app/images/logo.png" alt="2 Little Leashes" width="80" height="80" />
        <span class="brand-name">2 Little Leashes</span>
      </a>
      <p class="brand-sub">Rotorua · New Zealand</p>
    </div>`
}

function emailFooter(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || ''
  return `
    <div class="footer">
      <p style="margin:0 0 5px;">Questions? Reply to this email or call/text Meihana directly.</p>
      <p style="margin:0;"><a href="${url}">www.2littleleashes.co.nz</a> &nbsp;·&nbsp; 2 Little Leashes &nbsp;·&nbsp; Rotorua, New Zealand</p>
    </div>`
}

// ─── 1. Customer confirmation email ──────────────────────────────────────────
export async function sendCustomerConfirmation(data: BookingData) {
  const transporter = createTransport()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#1a3a2a;">
        <h1>🐾 Booking Received!</h1>
        <p>We'll be in touch within 24 hours</p>
      </div>

      <div class="body">
        <p class="greeting">Kia ora ${data.ownerName}! 👋</p>
        <p class="intro">
          We've received your booking request for <strong>${data.dogName}</strong>.
          Meihana will be in touch within 24 hours to arrange your free meet &amp; greet.
        </p>

        <div class="detail-box">
          <p class="detail-box-title">Booking Summary</p>
          <div class="detail-row"><span class="dl">Dog</span><span class="dv">${data.dogName}${data.breed ? ` (${data.breed})` : ''}</span></div>
          <div class="detail-row"><span class="dl">Service</span><span class="dv">${data.service}</span></div>
          ${data.preferredDate ? `<div class="detail-row"><span class="dl">Preferred start</span><span class="dv">${data.preferredDate}</span></div>` : ''}
          <div class="detail-row"><span class="dl">Meet &amp; greet</span><span class="dv">${data.meetGreetPref}</span></div>
        </div>

        ${data.bookingType === 'free' ? `
        <div class="callout-amber">
          🎉 <strong>Your first walk is FREE!</strong> This gives ${data.dogName} a chance to get comfortable with Meihana before the regular sessions begin.
        </div>
        <p class="steps-title">What happens next:</p>
        <div class="step"><div class="step-num">1</div><div class="step-text">Meihana will contact you within 24 hours to schedule your free meet &amp; greet at your home.</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-text">At the meet &amp; greet we go over ${data.dogName}'s personality, habits, and any medical needs.</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-text">Your first free walk is booked — and the adventures begin! 🌿</div></div>
        ` : `
        <p class="steps-title">What happens next:</p>
        <div class="step"><div class="step-num">1</div><div class="step-text">Meihana will contact you within 24 hours with payment details for your session.</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-text">Once you've made your transfer, reply to this email with a screenshot so Meihana can verify it.</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-text">Meihana will confirm your booking and be in touch with pickup details. 🌿</div></div>
        `}
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.email,
    subject: `🐾 Booking received for ${data.dogName} — 2 Little Leashes`,
    html,
  })
}

// ─── 2. Owner alert email ─────────────────────────────────────────────────────
export async function sendOwnerAlert(data: BookingData) {
  const transporter = createTransport()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${SHARED_CSS}
    table{width:100%;border-collapse:collapse;margin-top:4px;}
    td{padding:9px 12px;border-bottom:1px solid #f0ede6;font-size:13px;vertical-align:top;}
    td:first-child{color:#7a9080;width:38%;white-space:nowrap;}
    td:last-child{font-weight:600;color:#1a3a2a;}
    .badge-free{display:inline-block;background:#fef3c7;border:1px solid #fcd34d;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;color:#92400e;margin-left:8px;}
    .badge-paid{display:inline-block;background:#e0f2f1;border:1px solid #4db6ac;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700;color:#00695c;margin-left:8px;}
    .notes-box{background:#f3f8f5;border:1px solid #cfe4d7;border-radius:8px;padding:14px 16px;margin-top:16px;font-size:13px;color:#5a7060;line-height:1.55;}
    .notes-box strong{color:#1a3a2a;display:block;margin-bottom:6px;}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#92400e;">
        <h1>🔔 New Booking Request</h1>
        <p>Submitted via the 2 Little Leashes website</p>
      </div>

      <div class="body">
        <p class="intro" style="margin-bottom:4px;">
          A new booking has come in — details below.
          ${data.bookingType === 'free'
            ? `<span class="badge-free">Free first walk</span>`
            : `<span class="badge-paid">Paid booking</span>`}
        </p>

        <div class="detail-box">
          <p class="detail-box-title">Owner &amp; Dog</p>
          <table>
            <tr><td>Owner</td><td>${data.ownerName}</td></tr>
            <tr><td>Email</td><td><a href="mailto:${data.email}" style="color:#1a3a2a;">${data.email}</a></td></tr>
            <tr><td>Phone</td><td>${data.phone || '—'}</td></tr>
            <tr><td>Suburb</td><td>${data.suburb || '—'}</td></tr>
            <tr><td>Dog</td><td>${data.dogName}</td></tr>
            <tr><td>Breed &amp; age</td><td>${data.breed || '—'}</td></tr>
            <tr><td>Service</td><td>${data.service}</td></tr>
            <tr><td>Preferred start</td><td>${data.preferredDate || '—'}</td></tr>
            <tr><td>Meet &amp; greet</td><td>${data.meetGreetPref}</td></tr>
            ${data.bookingType === 'paid' ? `<tr><td>Payment ref</td><td style="font-family:monospace;letter-spacing:1px;">${data.paymentRef}</td></tr>` : ''}
          </table>
        </div>

        ${data.notes ? `<div class="notes-box"><strong>Customer notes:</strong>${data.notes}</div>` : ''}
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      process.env.OWNER_EMAIL,
    subject: `🐕 New booking: ${data.dogName} (${data.ownerName}) — ${data.service}`,
    html,
  })
}

// ─── 3. Walk reminder (call this ~24h before via cron or scheduler) ───────────
export async function sendWalkReminder(data: {
  ownerEmail: string
  ownerName: string
  dogName: string
  walkTime: string
  walkerName?: string
}) {
  const transporter = createTransport()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#d97706;">
        <h1>⏰ Walk reminder for ${data.dogName}!</h1>
        <p>Tomorrow at ${data.walkTime}</p>
      </div>

      <div class="body">
        <p class="greeting">Kia ora ${data.ownerName}!</p>
        <p class="intro">
          Just a friendly reminder that <strong>${data.dogName}'s walk is tomorrow at ${data.walkTime}</strong>.
          Meihana will be there to pick them up — looking forward to it! 🐾
        </p>

        <div class="detail-box">
          <p class="detail-box-title">Before the walk — quick checklist</p>
          <div class="detail-row"><span class="dl">✓</span><span class="dv" style="font-weight:400;color:#1c2b22;">Collar and ID tag on</span></div>
          <div class="detail-row"><span class="dl">✓</span><span class="dv" style="font-weight:400;color:#1c2b22;">Gate or front door unlocked for pick-up</span></div>
          <div class="detail-row"><span class="dl">✓</span><span class="dv" style="font-weight:400;color:#1c2b22;">Water bowl accessible on return</span></div>
          <div class="detail-row"><span class="dl">✓</span><span class="dv" style="font-weight:400;color:#1c2b22;">Let us know of any changes via text</span></div>
        </div>

        <p style="font-size:13px;color:#5a7060;margin:20px 0 0;">See you tomorrow — ${data.dogName} is going to have a blast! 🌿</p>
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.ownerEmail,
    subject: `⏰ Walk reminder: ${data.dogName} tomorrow at ${data.walkTime}`,
    html,
  })
}

// ─── 4. Post-walk review request ──────────────────────────────────────────────
export async function sendReviewRequest(data: {
  ownerEmail: string
  ownerName: string
  dogName: string
  googleReviewUrl?: string
}) {
  const transporter = createTransport()
  const reviewUrl = data.googleReviewUrl || 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#1a3a2a;">
        <h1>🐾 How was ${data.dogName}'s walk?</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div class="body" style="text-align:center;">
        <p class="greeting" style="text-align:center;">Kia ora ${data.ownerName}!</p>
        <p class="intro" style="text-align:center;">
          Hope ${data.dogName} came home happy and tired! 😄<br>
          If you have 30 seconds, a Google review makes a huge difference for a small local business like ours.
        </p>

        <div style="font-size:30px;margin:20px 0;">⭐⭐⭐⭐⭐</div>

        <a href="${reviewUrl}" class="btn btn-amber">Leave a quick review →</a>

        <p style="font-size:12px;color:#a0b0a5;margin:24px 0 0;">No worries if not — we'll see you on the next walk! 🌿</p>
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.ownerEmail,
    subject: `⭐ How was ${data.dogName}'s walk? (30-second review)`,
    html,
  })
}

// ─── 5. Win-back / lapsed client email ───────────────────────────────────────
export async function sendWinBackEmail(data: {
  ownerEmail: string
  ownerName: string
  dogName: string
  discountCode?: string
}) {
  const transporter = createTransport()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${SHARED_CSS}
    .coupon{background:#fffbeb;border:2px dashed #f59e0b;border-radius:10px;padding:20px;text-align:center;margin:20px 0;}
    .coupon-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;margin:0 0 8px;}
    .coupon-code{font-size:24px;font-weight:800;color:#1a3a2a;letter-spacing:3px;margin:6px 0;}
    .coupon-note{font-size:12px;color:#92400e;margin:6px 0 0;}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#1a3a2a;">
        <h1>🐾 We miss ${data.dogName}!</h1>
        <p>It's been a while — come back for a walk</p>
      </div>

      <div class="body">
        <p class="greeting">Kia ora ${data.ownerName}!</p>
        <p class="intro">
          It's been a little while since ${data.dogName} was out on the trails with us, and we've been thinking about them. 🌿
        </p>
        <p style="font-size:14px;color:#5a7060;line-height:1.65;margin:0 0 20px;">
          If life got busy, we totally get it — we'd love to have ${data.dogName} back on a walk whenever you're ready.
        </p>

        ${data.discountCode ? `
        <div class="coupon">
          <p class="coupon-label">Welcome back discount</p>
          <div class="coupon-code">${data.discountCode}</div>
          <p class="coupon-note">10% off your next walk — just mention this code when booking</p>
        </div>
        ` : ''}

        <div style="text-align:center;margin-top:24px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/book" class="btn btn-amber">Book a walk for ${data.dogName} →</a>
        </div>

        <p style="font-size:12px;color:#a0b0a5;margin:24px 0 0;text-align:center;">
          Miss you both! — Meihana &amp; the 2 Little Leashes team 🐾
        </p>
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.ownerEmail,
    subject: `🐾 We miss ${data.dogName}! Come back for a walk 🌿`,
    html,
  })
}

// ─── 6. Booking confirmed (after payment verified) ────────────────────────────
export async function sendBookingConfirmed(data: {
  ownerName: string
  email: string
  dogName: string
  preferredDate: string
}) {
  const transporter = createTransport()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${SHARED_CSS}
    .verified-badge{display:inline-block;background:#e0f2f1;border:1px solid #4db6ac;border-radius:20px;padding:6px 18px;font-size:13px;font-weight:700;color:#00695c;letter-spacing:.5px;margin-bottom:18px;}
    .confirm-box{background:#e8f8f4;border:1px solid #a7dece;border-radius:10px;padding:20px 22px;margin:16px 0;font-size:14px;color:#1c2b22;line-height:1.7;}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${logoSection()}

      <div class="email-header" style="background:#1D9E75;">
        <h1>✅ Booking Confirmed!</h1>
        <p>2 Little Leashes Dog Walkers · Rotorua</p>
      </div>

      <div class="body">
        <div class="verified-badge">✓ Payment verified</div>
        <p class="greeting">Kia ora ${data.ownerName}! 🎉</p>

        <div class="confirm-box">
          <p style="margin:0 0 10px;">Your booking for <strong>${data.dogName}</strong> is confirmed!</p>
          ${data.preferredDate ? `<p style="margin:0 0 10px;">We'll see you on <strong>${data.preferredDate}</strong>.</p>` : ''}
          <p style="margin:0;">Meihana will be in touch with pickup details. 🐾</p>
        </div>

        <p style="font-size:13px;color:#5a7060;margin:20px 0 0;line-height:1.65;">
          If you have any questions, just reply to this email. We can't wait to take ${data.dogName} out on an adventure!
        </p>
        <p style="font-size:13px;color:#5a7060;margin:12px 0 0;">
          Ngā mihi nui — Meihana &amp; the 2 Little Leashes team 🐾
        </p>
      </div>

      ${emailFooter()}
    </div>
  </div>
</body>
</html>`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.email,
    subject: `✅ Booking confirmed for ${data.dogName} — 2 Little Leashes`,
    html,
  })
}
