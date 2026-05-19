import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://2littleleashes.co.nz'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/book`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gallery`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  ]
}
