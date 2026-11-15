// src/components/Navbar.tsx
// Server wrapper: loads editable banner text, then renders the interactive navbar.
import NavbarClient from '@/components/NavbarClient'
import { getContent } from '@/lib/content'

export default async function Navbar() {
  const c = await getContent()
  const marquee = [1, 2, 3, 4].map(n => c[`marquee.${n}`])
  return <NavbarClient marquee={marquee} />
}
