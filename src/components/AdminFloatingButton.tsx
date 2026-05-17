'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminFloatingButton() {
  const [loggedIn, setLoggedIn] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!loggedIn || pathname.startsWith('/admin')) return null

  return (
    <Link
      href="/admin"
      className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-teal-500 active:scale-95"
    >
      <LayoutDashboard size={15} />
      Admin Dashboard →
    </Link>
  )
}
