// src/components/MarqueeBanner.tsx
import { PawPrint, MapPin, Camera, Car, Zap, DollarSign, Shield } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ITEMS: { icon: LucideIcon; text: string }[] = [
  { icon: PawPrint,   text: 'First walk FREE for new clients' },
  { icon: MapPin,     text: 'GPS tracked every walk' },
  { icon: Camera,     text: 'Photo update every session' },
  { icon: Car,        text: 'Free pick-up & drop-off' },
  { icon: Zap,        text: 'Sunday endurance runs 10km+' },
  { icon: DollarSign, text: 'Flexible & affordable for every whānau' },
  { icon: Shield,     text: 'Supervised by Dad — always' },
]

function BannerContent() {
  return (
    <>
      {ITEMS.map(({ icon: Icon, text }) => (
        <span key={text} className="inline-flex items-center shrink-0">
          <span className="inline-flex items-center gap-1.5">
            <Icon size={13} />
            {text}
          </span>
          <span className="mx-8 opacity-40">·</span>
        </span>
      ))}
    </>
  )
}

export default function MarqueeBanner() {
  return (
    <div className="overflow-hidden bg-forest-600 py-2 select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        <span className="flex shrink-0 items-center text-sm font-medium text-white">
          <BannerContent />
        </span>
        <span className="flex shrink-0 items-center text-sm font-medium text-white" aria-hidden>
          <BannerContent />
        </span>
      </div>
    </div>
  )
}
