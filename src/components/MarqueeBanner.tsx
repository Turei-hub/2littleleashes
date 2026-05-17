// src/components/MarqueeBanner.tsx

const ITEMS = [
  '🐾 First walk FREE for new clients',
  '🦮 GPS tracked every walk',
  '📸 Photo update every session',
  '🚗 Free pick-up & drop-off',
  '🏃 Sunday endurance runs 10km+',
  '💌 Flexible & affordable for every whānau',
  '🐶 Supervised by Dad — always',
]

function BannerContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="inline-flex items-center shrink-0">
          <span>{item}</span>
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
