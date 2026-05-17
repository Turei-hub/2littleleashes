// src/components/ServiceCard.tsx
import Link from 'next/link'
import clsx from 'clsx'

interface ServiceCardProps {
  icon:       string
  title:      string
  tagline:    string
  priceLabel: string
  badge?:     string | null
  highlight?: boolean
  features?:  readonly string[]
  compact?:   boolean
}

export default function ServiceCard({
  icon,
  title,
  tagline,
  priceLabel,
  badge,
  highlight = false,
  features,
  compact = false,
}: ServiceCardProps) {
  return (
    <div
      className={clsx(
        'group rounded-xl border p-5 transition',
        highlight
          ? 'border-amber-400 bg-amber-50'
          : 'border-forest-700/10 bg-white hover:border-forest-700/25 hover:shadow-sm'
      )}
    >
      <div className="mb-3 text-3xl">{icon}</div>
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
          {badge}
        </span>
      )}
      <h3 className="font-display text-base font-semibold text-forest-700">{title}</h3>
      <p className="mt-0.5 text-xs text-forest-600/70">{tagline}</p>
      <p className="mt-2 text-sm font-semibold text-amber-600">{priceLabel}</p>

      {features && !compact && (
        <ul className="mt-3 space-y-1.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-forest-600">
              <span className="mt-0.5 shrink-0 text-forest-500">✓</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/book"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 transition hover:text-amber-500"
      >
        Book this service →
      </Link>
    </div>
  )
}
