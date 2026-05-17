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

// ─── 1. Customer confirmation email ──────────────────────────────────────────
export async function sendCustomerConfirmation(data: BookingData) {
  const transporter = createTransport()

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #faf8f4; margin: 0; padding: 20px; color: #1c2b22; }
    .card { background: #fff; border-radius: 12px; max-width: 540px; margin: 0 auto; overflow: hidden; border: 1px solid #e0ddd6; }
    .header { background: #1a3a2a; padding: 28px 32px; }
    .header h1 { color: #fff; font-size: 22px; margin: 0 0 4px; }
    .header p { color: rgba(255,255,255,0.6); margin: 0; font-size: 13px; }
    .body { padding: 28px 32px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .detail-box { background: #e8f2ec; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .detail-box h3 { color: #1a3a2a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px; }
    .detail-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; border-bottom: 1px solid rgba(26,58,42,0.1); }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #5a7060; }
    .detail-value { font-weight: 600; color: #1a3a2a; }
    .highlight { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #92400e; }
    .steps { margin: 20px 0; }
    .step { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
    .step-num { background: #1a3a2a; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #5a7060; padding-top: 3px; }
    .footer { background: #f0ede6; padding: 20px 32px; font-size: 12px; color: #93a89a; text-align: center; }
    .footer a { color: #1a3a2a; text-decoration: none; font-weight: 600; }
    @media (max-width: 600px) { .body, .header, .footer { padding: 20px; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🐾 Booking Received!</h1>
      <p>2 Little Leashes Dog Walkers · Rotorua</p>
    </div>
    <div class="body">
      <p class="greeting">Kia ora ${data.ownerName}! 👋</p>
      <p style="font-size:14px;color:#5a7060;line-height:1.6;">
        We've received your booking request for <strong>${data.dogName}</strong>. 
        Meihana will be in touch within 24 hours to arrange your free meet &amp; greet.
      </p>

      <div class="detail-box">
        <h3>Booking Summary</h3>
        <div class="detail-row"><span class="detail-label">Dog</span><span class="detail-value">${data.dogName}${data.breed ? ` (${data.breed})` : ''}</span></div>
        <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${data.service}</span></div>
        ${data.preferredDate ? `<div class="detail-row"><span class="detail-label">Preferred start</span><span class="detail-value">${data.preferredDate}</span></div>` : ''}
        <div class="detail-row"><span class="detail-label">Meet &amp; greet</span><span class="detail-value">${data.meetGreetPref}</span></div>
      </div>

      <div class="highlight">
        🎉 <strong>Reminder: your first walk is FREE!</strong> This gives ${data.dogName} a chance to get comfortable with Meihana before the regular sessions begin.
      </div>

      <div class="steps">
        <p style="font-size:13px;font-weight:600;color:#1a3a2a;margin-bottom:12px;">What happens next:</p>
        <div class="step"><div class="step-num">1</div><div class="step-text">Meihana will contact you within 24 hours to schedule your free meet &amp; greet at your home.</div></div>
        <div class="step"><div class="step-num">2</div><div class="step-text">At the meet &amp; greet we go over ${data.dogName}'s personality, habits, and any medical needs.</div></div>
        <div class="step"><div class="step-num">3</div><div class="step-text">Your first free walk is booked — and the adventures begin! 🌿</div></div>
      </div>
    </div>
    <div class="footer">
      <p>Questions? Reply to this email or call/text Meihana directly.</p>
      <p style="margin-top:8px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL}">2littleleashes.co.nz</a> · Rotorua, New Zealand</p>
    </div>
  </div>
</body>
</html>
`

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

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .card { background: #fff; border-radius: 10px; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; }
    h2 { color: #1a3a2a; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    td:first-child { color: #666; width: 40%; }
    td:last-child { font-weight: 600; color: #1c2b22; }
    .notes { background: #f9f9f9; border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 13px; color: #444; }
  </style>
</head>
<body>
  <div class="card">
    <h2>🔔 New Booking Request</h2>
    <p style="color:#666;font-size:14px;">A new booking has been submitted on the website.</p>
    <table>
      <tr><td>Owner</td><td>${data.ownerName}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
      <tr><td>Phone</td><td>${data.phone || '—'}</td></tr>
      <tr><td>Suburb</td><td>${data.suburb || '—'}</td></tr>
      <tr><td>Dog</td><td>${data.dogName}</td></tr>
      <tr><td>Breed &amp; age</td><td>${data.breed || '—'}</td></tr>
      <tr><td>Service</td><td>${data.service}</td></tr>
      <tr><td>Preferred start</td><td>${data.preferredDate || '—'}</td></tr>
      <tr><td>Meet &amp; greet pref</td><td>${data.meetGreetPref}</td></tr>
    </table>
    ${data.notes ? `<div class="notes"><strong>Notes:</strong><br>${data.notes}</div>` : ''}
  </div>
</body>
</html>
`

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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f4;padding:20px}
  .card{background:#fff;border-radius:12px;max-width:500px;margin:0 auto;overflow:hidden;border:1px solid #e0ddd6}
  .header{background:#d97706;padding:24px 28px}
  .header h1{color:#fff;margin:0;font-size:20px}
  .body{padding:24px 28px;font-size:14px;color:#1c2b22;line-height:1.6}
  .checklist{background:#e8f2ec;border-radius:8px;padding:14px 18px;margin:16px 0}
  .checklist h3{color:#1a3a2a;font-size:12px;text-transform:uppercase;letter-spacing:.5px;margin:0 0 10px}
  .checklist li{font-size:13px;color:#2d5a3d;margin-bottom:6px}
</style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>⏰ Walk reminder for ${data.dogName} — tomorrow!</h1></div>
    <div class="body">
      <p>Kia ora ${data.ownerName}!</p>
      <p>Just a reminder that <strong>${data.dogName}'s walk is tomorrow at ${data.walkTime}</strong>. Meihana will be there to pick them up. 🐾</p>
      <div class="checklist">
        <h3>Before the walk</h3>
        <ul>
          <li>Collar and ID tag on</li>
          <li>Gate or front door unlocked for pick-up</li>
          <li>Water bowl accessible on return</li>
          <li>Let us know of any changes via text</li>
        </ul>
      </div>
      <p style="color:#666;font-size:13px;">See you tomorrow! 🌿</p>
    </div>
  </div>
</body>
</html>
`

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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f4;padding:20px}
  .card{background:#fff;border-radius:12px;max-width:500px;margin:0 auto;overflow:hidden;border:1px solid #e0ddd6}
  .header{background:#1a3a2a;padding:24px 28px}
  .header h1{color:#fff;margin:0;font-size:20px}
  .body{padding:24px 28px;font-size:14px;color:#1c2b22;line-height:1.6;text-align:center}
  .stars{font-size:28px;margin:16px 0}
  .btn{display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;margin-top:12px}
</style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>🐾 How was ${data.dogName}'s walk?</h1></div>
    <div class="body">
      <p>Kia ora ${data.ownerName}! Hope ${data.dogName} came home happy and tired. 😄</p>
      <p>If you have 30 seconds, a Google review makes a huge difference for a small local business like ours.</p>
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <a href="${reviewUrl}" class="btn">Leave a quick review →</a>
      <p style="font-size:12px;color:#999;margin-top:20px;">No worries if not — see you on the next walk!</p>
    </div>
  </div>
</body>
</html>
`

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

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#faf8f4;padding:20px}
  .card{background:#fff;border-radius:12px;max-width:500px;margin:0 auto;overflow:hidden;border:1px solid #e0ddd6}
  .header{background:#1a3a2a;padding:24px 28px}
  .header h1{color:#fff;margin:0;font-size:20px}
  .body{padding:24px 28px;font-size:14px;color:#1c2b22;line-height:1.6}
  .coupon{background:#fef3c7;border:2px dashed #f59e0b;border-radius:10px;padding:16px;text-align:center;margin:20px 0}
  .coupon-code{font-size:22px;font-weight:800;color:#1a3a2a;letter-spacing:2px;margin:6px 0}
  .btn{display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:11px 24px;border-radius:8px;font-weight:700;font-size:14px;margin-top:8px}
</style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>🐾 We miss ${data.dogName}!</h1></div>
    <div class="body">
      <p>Kia ora ${data.ownerName}!</p>
      <p>It's been a little while since ${data.dogName} was out on the trails with us, and we've been thinking about them. 🌿</p>
      <p>If life got busy, we totally get it — we'd love to have ${data.dogName} back on a walk when you're ready.</p>
      ${data.discountCode ? `
      <div class="coupon">
        <p style="font-size:12px;color:#92400e;margin:0;text-transform:uppercase;letter-spacing:.5px;">Welcome back discount</p>
        <div class="coupon-code">${data.discountCode}</div>
        <p style="font-size:12px;color:#92400e;margin:4px 0 0;">10% off your next walk — just mention this code</p>
      </div>
      ` : ''}
      <div style="text-align:center">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/book" class="btn">Book a walk for ${data.dogName} →</a>
      </div>
      <p style="font-size:12px;color:#999;margin-top:20px;">Miss you both! — Meihana &amp; the 2 Little Leashes team 🐾</p>
    </div>
  </div>
</body>
</html>
`

  await transporter.sendMail({
    from:    process.env.FROM_EMAIL,
    to:      data.ownerEmail,
    subject: `🐾 We miss ${data.dogName}! Come back for a walk 🌿`,
    html,
  })
}
