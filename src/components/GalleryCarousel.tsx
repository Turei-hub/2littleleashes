'use client'
// src/components/GalleryCarousel.tsx

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const IMAGES = [
  ...Array.from({ length: 15 }, (_, i) => `/images/dog-photo-${i + 1}.jpg`),
  '/images/dog-walk-rotorua.jpg',
  '/images/meihana-bulldogs-truck.jpg',
  '/images/pack-walk-truck.jpg',
]

// Only keep prev/current/next mounted so the other 15 images aren't loaded at all
function nearbySet(current: number, total: number) {
  return new Set([
    (current - 1 + total) % total,
    current,
    (current + 1) % total,
  ])
}

export default function GalleryCarousel() {
  const [featured, setFeatured] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [paused,   setPaused]   = useState(false)
  const [loaded,   setLoaded]   = useState<Set<number>>(new Set())

  const prevFeatured = useCallback(() => setFeatured(i => (i - 1 + IMAGES.length) % IMAGES.length), [])
  const nextFeatured = useCallback(() => setFeatured(i => (i + 1) % IMAGES.length), [])
  const prevLb       = useCallback(() => setLightbox(i => i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null), [])
  const nextLb       = useCallback(() => setLightbox(i => i !== null ? (i + 1) % IMAGES.length : null), [])

  // Auto-cycle featured photo
  useEffect(() => {
    if (paused || lightbox !== null) return
    const t = setInterval(nextFeatured, 3000)
    return () => clearInterval(t)
  }, [paused, lightbox, nextFeatured])

  // Keyboard nav in lightbox
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

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const nearby = nearbySet(featured, IMAGES.length)

  return (
    <>
      {/* ── FEATURED AUTO-CYCLING PHOTO ──────────────────────────────────────── */}
      <div
        className="group relative h-[400px] w-full cursor-pointer overflow-hidden bg-forest-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setLightbox(featured)}
      >
        {IMAGES.map((src, i) => {
          // Only mount the 3 images around the current — keeps 15 images out of the DOM
          if (!nearby.has(i)) return null
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === featured ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={src}
                alt={`Featured dog photo ${i + 1}`}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain"
                priority={i === featured}
              />
            </div>
          )
        })}

        {/* Arrows */}
        <button
          onClick={e => { e.stopPropagation(); prevFeatured() }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-forest-600"
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={e => { e.stopPropagation(); nextFeatured() }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-forest-600"
          aria-label="Next photo"
        >
          <ChevronRight size={22} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-4 z-10 rounded-full bg-forest-700/70 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
          {featured + 1} / {IMAGES.length}
        </div>

        {/* Expand hint */}
        <div className="absolute bottom-3 left-4 z-10 rounded-full bg-forest-700/60 px-3 py-1 text-xs text-white/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
          Click to expand
        </div>
      </div>

      {/* ── MASONRY GRID ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-forest-600/60">All photos · click any to expand</p>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {IMAGES.map((src, i) => (
            <div
              key={src}
              className="relative mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl bg-forest-100"
              onClick={() => setLightbox(i)}
            >
              {/* Skeleton pulse shown until image loads */}
              {!loaded.has(i) && (
                <div className="absolute inset-0 animate-pulse bg-forest-100" />
              )}
              <Image
                src={src}
                alt={`Dog photo ${i + 1}`}
                width={600}
                height={800}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                quality={80}
                style={{ width: '100%', height: 'auto' }}
                className={`rounded-xl transition-opacity duration-500 hover:opacity-90 ${
                  loaded.has(i) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setLoaded(prev => new Set(prev).add(i))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────────── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-forest-600 sm:left-8"
            onClick={e => { e.stopPropagation(); prevLb() }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} />
          </button>

          {/* Image */}
          <div
            className="relative h-[85vh] w-[90vw] max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={IMAGES[lightbox]}
              alt={`Dog photo ${lightbox + 1}`}
              fill
              sizes="(max-width: 896px) 90vw, 896px"
              quality={85}
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg transition hover:bg-forest-600 sm:right-8"
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
