'use client'
// src/components/GalleryCarousel.tsx

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const ALL_IMAGES = [
  ...Array.from({ length: 15 }, (_, i) => `dog-photo-${i + 1}.jpg`),
  'dog-walk-rotorua.jpg',
  'meihana-bulldogs-truck.jpg',
  'pack-walk-truck.jpg',
]

const IMAGES = ALL_IMAGES.map(name => `/images/${name}`)

export default function GalleryCarousel() {
  const [current,  setCurrent]  = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [paused,   setPaused]   = useState(false)

  const prev = useCallback(() => setCurrent(i => (i - 1 + IMAGES.length) % IMAGES.length), [])
  const next = useCallback(() => setCurrent(i => (i + 1) % IMAGES.length), [])

  const prevLb = useCallback(() => setLightbox(i => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null), [])
  const nextLb = useCallback(() => setLightbox(i => i !== null ? (i + 1) % IMAGES.length : null), [])

  // Auto-play — pause when hovered or lightbox is open
  useEffect(() => {
    if (paused || lightbox !== null) return
    const t = setInterval(next, 3000)
    return () => clearInterval(t)
  }, [paused, lightbox, next])

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prevLb()
      if (e.key === 'ArrowRight') nextLb()
      if (e.key === 'Escape')     setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prevLb, nextLb])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <>
      {/* ── CAROUSEL ─────────────────────────────────────────────────────────── */}
      <div
        className="group relative h-[600px] w-full cursor-pointer overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setLightbox(current)}
      >
        {/* Slides */}
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={src}
              alt={`Dog photo ${i + 1}`}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Prev arrow */}
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-amber-500 sm:left-5 sm:h-13 sm:w-13"
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next arrow */}
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-amber-500 sm:right-5 sm:h-13 sm:w-13"
          aria-label="Next photo"
        >
          <ChevronRight size={22} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-amber-400'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* "Click to expand" hint — appears on hover */}
        <div className="absolute right-4 top-4 z-10 rounded-full bg-forest-700/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
          Click to expand
        </div>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          {/* Close button */}
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-forest-600/80 text-white transition hover:bg-forest-500 sm:left-8"
            onClick={e => { e.stopPropagation(); prevLb() }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Image */}
          <div
            className="relative h-[82vh] w-[92vw] max-w-5xl"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={IMAGES[lightbox]}
              alt={`Dog photo ${lightbox + 1}`}
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-forest-600/80 text-white transition hover:bg-forest-500 sm:right-8"
            onClick={e => { e.stopPropagation(); nextLb() }}
            aria-label="Next photo"
          >
            <ChevronRight size={26} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-forest-700/70 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
            {lightbox + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </>
  )
}
