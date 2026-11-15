// src/lib/content-defaults.ts
// Every owner-editable piece of site content, with its current live value as
// the fallback. Keys/labels/sections here must match supabase/seed_site_content.sql.
// Safe to import from client components (no server-only code).

export type ContentType = 'text' | 'textarea' | 'price' | 'image'

export type ContentField = {
  key:     string
  label:   string
  type:    ContentType
  section: string
  value:   string
}

const f = (section: string, key: string, label: string, type: ContentType, value: string): ContentField =>
  ({ key, label, type, section, value })

const PRICING  = 'Pricing'
const HERO     = 'Home – Hero'
const WHY      = 'Home – Why Choose Us'
const REVIEWS  = 'Home – Reviews'
const POLICIES = 'Home – Policies'
const CTA      = 'Home – Final CTA'
const MARQUEE  = 'Scrolling Banner'
const ABOUT    = 'About Page'
const BOOK     = 'Booking Page'
const GALLERY  = 'Gallery Page'
const FOOTER   = 'Footer'

// Order here = order in the admin form (sort_order).
export const CONTENT_FIELDS: ContentField[] = [
  // ── Pricing ──────────────────────────────────────────────────────────────
  f(PRICING, 'price.walk_1x',           'Walk price (1 day/week)',        'price', '30'),
  f(PRICING, 'service.walk_1x',         'Walk (1 day/week) description',  'text',  'Dog Walk upto 1 hour for 1 WALK A WEEK'),
  f(PRICING, 'price.walk_multi',        'Walk price (2+ days/week)',      'price', '25'),
  f(PRICING, 'service.walk_multi',      'Walk (2+ days) description',     'text',  'Dog Walk for upto 1 hour for 2 OR MORE DAYS OF WEEK'),
  f(PRICING, 'price.extra_dog',         'Extra dog price',                'price', '15'),
  f(PRICING, 'service.extra_dog',       'Extra dog description',          'text',  'For extra dog ( If you have 2 or more dogs )'),
  f(PRICING, 'price.dog_wash',          'Dog wash price (per dog)',       'price', '25'),
  f(PRICING, 'service.dog_wash',        'Dog wash description',           'text',  'Dog Wash ( Per Dog ) Pick up - Wash - Drop off'),
  f(PRICING, 'price.checkin',           'Check-in service price',         'price', '25'),
  f(PRICING, 'service.checkin',         'Check-in description',           'text',  'Check in Service . Feed, Fresh Water, Clean Waste, Security Check of Property'),
  f(PRICING, 'price.weekend_surcharge', 'Weekend surcharge (per walk)',   'price', '20'),

  // ── Home – Hero ──────────────────────────────────────────────────────────
  f(HERO, 'home.hero.image',  'Hero photo',   'image',    '/images/meihana-bulldogs-truck.jpg'),
  f(HERO, 'home.hero.badge',  'Hero badge',   'text',     'Rotorua, New Zealand · Est. 2022'),
  f(HERO, 'home.hero.title',  'Hero heading', 'text',     '2 Little Leashes Dog Walkers Rotorua'),
  f(HERO, 'home.hero.intro',  'Hero intro',   'textarea', "Kia ora! We're 2 Little Leashes – A dog-crazy whānau who absolutely LOVE spending time with furry friends. Rain or shine, we're ready with leashes, smiles, treats, and heaps of energy!"),
  f(HERO, 'home.hero.pill_1', 'Hero pill 1',  'text',     'Photo update every session'),
  f(HERO, 'home.hero.pill_2', 'Hero pill 2',  'text',     'Free pick-up & drop-off'),

  // ── Home – Why Choose Us ─────────────────────────────────────────────────
  f(WHY, 'home.why.eyebrow', 'Small heading', 'text', 'Why choose us'),
  f(WHY, 'home.why.heading', 'Heading',       'text', "We're different — here's why"),
  f(WHY, 'home.why.1.title', 'Card 1 title',  'text', 'Local Family Business'),
  f(WHY, 'home.why.1.body',  'Card 1 text',   'text', 'Safe, friendly & full of care'),
  f(WHY, 'home.why.2.title', 'Card 2 title',  'text', 'Always Supervised by Dad'),
  f(WHY, 'home.why.2.body',  'Card 2 text',   'text', 'Owner and main point of contact'),
  f(WHY, 'home.why.3.title', 'Card 3 title',  'text', 'Love, Laughs & Happy Tails'),
  f(WHY, 'home.why.3.body',  'Card 3 text',   'text', 'Every walk comes with genuine fun and care'),
  f(WHY, 'home.why.4.title', 'Card 4 title',  'text', 'Flexible & Affordable'),
  f(WHY, 'home.why.4.body',  'Card 4 text',   'text', 'For every whānau'),

  // ── Home – Reviews ───────────────────────────────────────────────────────
  f(REVIEWS, 'home.reviews.eyebrow',    'Small heading',   'text',     'Happy clients'),
  f(REVIEWS, 'home.reviews.heading',    'Heading',         'text',     'What Rotorua families say'),
  f(REVIEWS, 'home.reviews.subheading', 'Subheading',      'text',     'Real reviews from real Rotorua dog owners.'),
  // The reviews themselves live in the `reviews` table — managed in the admin Reviews tab.

  // ── Home – Policies ──────────────────────────────────────────────────────
  f(POLICIES, 'home.policies.eyebrow',    'Small heading',  'text',     'How we work'),
  f(POLICIES, 'home.policies.heading',    'Heading',        'text',     'What to expect'),
  f(POLICIES, 'home.policies.subheading', 'Subheading',     'text',     'Simple policies, no surprises.'),
  f(POLICIES, 'policy.1.title',           'Policy 1 title', 'text',     'Meet & Greet First'),
  f(POLICIES, 'policy.1.body',            'Policy 1 text',  'textarea', 'Mandatory for all new clients. We come to you, meet your dog, go over personality, habits, and any medical instructions.'),
  f(POLICIES, 'policy.2.title',           'Policy 2 title', 'text',     'Operating Hours (Winter)'),
  f(POLICIES, 'policy.2.body',            'Policy 2 text',  'textarea', '7:00 AM – 2:00 PM during daylight savings.'),
  f(POLICIES, 'policy.3.title',           'Policy 3 title', 'text',     'Free Pick-up & Drop-off'),
  f(POLICIES, 'policy.3.body',            'Policy 3 text',  'textarea', 'Included with all walks and washes. Safe transport, personally supervised by Meihana.'),
  f(POLICIES, 'policy.4.title',           'Policy 4 title', 'text',     'Weekend Surcharge'),
  f(POLICIES, 'policy.4.body',            'Policy 4 text (shown after "+$<weekend surcharge>")', 'textarea', 'flat per walk on Saturdays and Sundays.'),
  f(POLICIES, 'policy.5.title',           'Policy 5 title', 'text',     'Photo Updates'),
  f(POLICIES, 'policy.5.body',            'Policy 5 text',  'textarea', 'A photo sent after every session — your dog having the time of their life.'),

  // ── Home – Final CTA ─────────────────────────────────────────────────────
  f(CTA, 'home.cta.heading', 'Heading', 'text',     'Ready to get started?'),
  f(CTA, 'home.cta.body',    'Text',    'textarea', 'Fill out the booking form and Meihana will be in touch within 24 hours to arrange your free meet & greet.'),

  // ── Scrolling Banner ─────────────────────────────────────────────────────
  f(MARQUEE, 'marquee.1', 'Banner item 1', 'text', 'Photo update every session'),
  f(MARQUEE, 'marquee.2', 'Banner item 2', 'text', 'Free pick-up & drop-off'),
  f(MARQUEE, 'marquee.3', 'Banner item 3', 'text', 'Flexible & affordable for every whānau'),
  f(MARQUEE, 'marquee.4', 'Banner item 4', 'text', 'Supervised by Dad — always'),

  // ── About Page ───────────────────────────────────────────────────────────
  f(ABOUT, 'about.hero.image',    'Hero photo',          'image',    '/images/about-hero.jpg'),
  f(ABOUT, 'about.hero.eyebrow',  'Hero small heading',  'text',     'About us'),
  f(ABOUT, 'about.hero.heading',  'Hero heading',        'text',     'Our Whānau, Our Business'),
  f(ABOUT, 'about.hero.subtitle', 'Hero subtitle',       'text',     'A family dog walking and care business, built with love — right here in Rotorua.'),
  f(ABOUT, 'about.bio.image',     'Meihana portrait',    'image',    '/images/meihana.jpg'),
  f(ABOUT, 'about.bio.name',      'Name',                'text',     'Meihana Herbert'),
  f(ABOUT, 'about.bio.role',      'Role',                'text',     'Business Owner and Dad · 2 Little Leashes Rotorua'),
  f(ABOUT, 'about.bio.p1',        'Bio paragraph 1',     'textarea', "Kia ora! We're a whānau dog walking and care business right here in Rotorua."),
  f(ABOUT, 'about.bio.p2',        'Bio paragraph 2',     'textarea', "At 2 Little Leashes, it's all about the girls. They've grown up surrounded by dogs and cats their whole lives. Not long ago, we said goodbye to our beloved Corgi, Odie, who lived with us for 13 amazing years. He wasn't just a pet — he was part of our whānau."),
  f(ABOUT, 'about.bio.p3',        'Bio paragraph 3',     'textarea', "Now we've welcomed Coby and Tahu, our Auntie's cheeky British Bulldogs into our crew. Loud, lazy, funny, and full of personality — just like the girls."),
  f(ABOUT, 'about.bio.p4',        'Bio paragraph 4',     'textarea', "The girls came up with the idea themselves, and named it 2 Little Leashes all on their own. This isn't just a hobby — it's a lesson in commitment, care, and community."),
  f(ABOUT, 'about.why.heading',   'Why-us heading',      'text',     'Why clients choose us'),
  f(ABOUT, 'about.why.1.title',   'Why-us card 1 title', 'text',     'Photo after every session'),
  f(ABOUT, 'about.why.1.body',    'Why-us card 1 text',  'textarea', 'We send a photo update after every walk or visit so you can see your dog having the time of their life.'),
  f(ABOUT, 'about.why.2.title',   'Why-us card 2 title', 'text',     "Rotorua's best locations"),
  f(ABOUT, 'about.why.2.body',    'Why-us card 2 text',  'textarea', 'Forests, lake tracks, and bush paths — we mix up locations so walks stay exciting and stimulating.'),
  f(ABOUT, 'about.why.3.title',   'Why-us card 3 title', 'text',     'Free pick-up & drop-off'),
  f(ABOUT, 'about.why.3.body',    'Why-us card 3 text',  'textarea', 'We come to you. Your dog is collected and returned safely from your home.'),
  f(ABOUT, 'about.why.4.title',   'Why-us card 4 title', 'text',     'Meet & greet first'),
  f(ABOUT, 'about.why.4.body',    'Why-us card 4 text',  'textarea', 'Before any walk we visit your home, meet your dog, and understand their needs. No surprises.'),
  f(ABOUT, 'about.cta.heading',   'CTA heading',         'text',     'Ready to meet us?'),
  f(ABOUT, 'about.cta.body',      'CTA text',            'textarea', "Book online and we'll arrange a meet & greet at your home before your first session."),

  // ── Booking Page ─────────────────────────────────────────────────────────
  f(BOOK, 'book.hero.image',    'Hero photo',                    'image',    '/images/dog-walk-rotorua.jpg'),
  f(BOOK, 'book.hero.eyebrow',  'Hero small heading',            'text',     'New booking'),
  f(BOOK, 'book.hero.heading',  'Hero heading',                  'text',     'Book with 2 Little Leashes'),
  f(BOOK, 'book.hero.subtitle', 'Hero subtitle',                 'text',     "Fill out the form below and we'll get you booked in no time."),
  f(BOOK, 'book.success.next',  '"What\'s next" after booking',  'textarea', 'Meihana will contact you within 24 hours to confirm your booking.'),

  // ── Gallery Page ─────────────────────────────────────────────────────────
  f(GALLERY, 'gallery.hero.image',    'Hero photo',         'image', '/images/dog-walk-rotorua.jpg'),
  f(GALLERY, 'gallery.hero.eyebrow',  'Hero small heading', 'text',  'Gallery'),
  f(GALLERY, 'gallery.hero.heading',  'Hero heading',       'text',  'Happy dogs on happy walks'),
  f(GALLERY, 'gallery.hero.subtitle', 'Hero subtitle',      'text',  'Real photos from real walks — click any photo to expand. Auto-plays every 3 seconds.'),

  // ── Footer ───────────────────────────────────────────────────────────────
  f(FOOTER, 'footer.tagline',  'Footer blurb',          'textarea', 'Professional dog walking and caring in Rotorua, New Zealand. Photo updates every session.'),
  f(FOOTER, 'footer.hours',    'Hours',                 'text',     'Mon–Fri: 7:00 AM – 2:00 PM'),
  f(FOOTER, 'footer.location', 'Location',              'text',     'Based in Rotorua, NZ'),
  f(FOOTER, 'footer.pickup',   'Pick-up line',          'text',     'Free pick-up & drop-off'),
]

export const CONTENT_DEFAULTS: Record<string, string> =
  Object.fromEntries(CONTENT_FIELDS.map(c => [c.key, c.value]))

export type SiteContent = Record<string, string>

// Booking form services: stable id → content key suffix.
// The id is what the form submits; the label is built from content.
export const BOOKING_SERVICE_IDS = [
  { value: 'walk-1x',    key: 'walk_1x' },
  { value: 'walk-multi', key: 'walk_multi' },
  { value: 'extra-dog',  key: 'extra_dog' },
  { value: 'dog-wash',   key: 'dog_wash' },
  { value: 'checkin',    key: 'checkin' },
] as const

export type BookingService = { value: string; label: string }

export function bookingServices(content: SiteContent): BookingService[] {
  return BOOKING_SERVICE_IDS.map(s => ({
    value: s.value,
    label: `$${content[`price.${s.key}`]} - ${content[`service.${s.key}`]}`,
  }))
}
