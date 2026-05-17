'use client'
// src/components/Navbar.tsx

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Lock } from 'lucide-react'
import clsx from 'clsx'
import MarqueeBanner from '@/components/MarqueeBanner'

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/services',  label: 'Pricings and Services' },
  { href: '/gallery',   label: 'Gallery' },
  { href: '/about',     label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-50 bg-forest-700 shadow-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo.jpg"
            alt="2 Little Leashes"
            width={40}
            height={40}
            className="rounded-full transition group-hover:opacity-90"
          />
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-white">
              2 Little Leashes
            </p>
            <p className="text-[10px] font-light leading-tight text-white/50 tracking-wide">
              Rotorua, New Zealand
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-md px-3 py-1.5 text-sm font-medium transition',
                pathname === link.href
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="ml-2 rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-400 active:scale-95"
          >
            Book now →
          </Link>
          <span className="mx-2 h-5 w-px bg-white/20" aria-hidden="true" />
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 rounded-lg border border-white/25 px-3 py-1.5 text-sm font-medium text-white/60 transition hover:border-white/50 hover:text-white/90"
          >
            <Lock size={13} />
            Admin Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-forest-700 px-4 pb-4 md:hidden">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={clsx(
                'block rounded-md px-3 py-2 text-sm font-medium transition',
                pathname === link.href
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-amber-400"
          >
            Book now →
          </Link>
          <hr className="my-3 border-white/10" />
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/25 px-3 py-2 text-sm font-medium text-white/60 transition hover:border-white/50 hover:text-white/90"
          >
            <Lock size={13} />
            Admin Login
          </Link>
        </div>
      )}
    </header>
    <MarqueeBanner />
    </>
  )
}
