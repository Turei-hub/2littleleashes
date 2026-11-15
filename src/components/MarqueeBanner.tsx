// src/components/MarqueeBanner.tsx
import { Camera, Car, DollarSign, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: LucideIcon[] = [Camera, Car, DollarSign, Shield]

function BannerContent({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text, i) => {
        const Icon = ICONS[i % ICONS.length]
        return (
          <span key={i} className="inline-flex items-center shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <Icon size={13} />
              {text}
            </span>
            <span className="mx-8 opacity-40">·</span>
          </span>
        )
      })}
    </>
  )
}

export default function MarqueeBanner({ items }: { items: string[] }) {
  return (
    <div className="overflow-hidden bg-forest-600 py-2 select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        <span className="flex shrink-0 items-center text-sm font-medium text-white">
          <BannerContent items={items} />
        </span>
        <span className="flex shrink-0 items-center text-sm font-medium text-white" aria-hidden>
          <BannerContent items={items} />
        </span>
      </div>
    </div>
  )
}
