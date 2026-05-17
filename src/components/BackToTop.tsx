'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={[
        'fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full',
        'bg-forest-700 text-white shadow-lg transition-all duration-300',
        'hover:bg-forest-600 active:scale-95',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  )
}
