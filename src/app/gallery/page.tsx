// src/app/gallery/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Gallery | 2 Little Leashes Rotorua',
  description: 'Photos from walks and visits with 2 Little Leashes dog walkers in Rotorua, NZ.',
}

const IMAGES = [
  'att.buYauiExv-KJ71-gS_DX1BhXT1GuNhcE15SgSOdE5Lw.JPG',
  'att.CQieh2OtAzyLqYTGleKygtc3qFHAoj_mge0DyBiCLoM.JPG',
  'att.jzulYcFjfrCt6w6ySbFaTikTFJ7ur-NPH3GOCCzhwnw.JPG',
  'att.kbyYyUg-SOAJYdegM9YaeAoX7R3Vi-onoeBQ39VjWcs.JPG',
  'att.kruW9XTjBO92CZJiNaObGq5WqNRzbRHCKL2T9uweCT8.JPG',
  'att.MGyXYW3il0f696w8kaK-hr7igDMUq47Ttnwm8jXoXTg.JPG',
  'att.o62-7COnTnrm5RMLKDclHd25FqefCI-fSatopxRSxWE.JPG',
  'att.pEBvY_XurccN5gmcS9wpnY36dOCvlGYlVeMB8jVz8kQ.JPG',
  'att.q7bj3aFo2GSrDsU8YekhNDuKMe2cgy_S0JIh2v3_ynQ.JPG',
  'att.Snat5bRmVSXMgRM90fuXcHdQeZp56h8sulXsUOmlJlU.JPG',
  'att.v7AdpTW4OVT7Zcy8LLH1Pqd7fX6zVeLh3mif6GirCTg.JPG',
  'att.VqmBkRwvF1XYh-z3A_NrYoo1oRFNK0l7kAYZmX4smJg.JPG',
  'att.vr7KAwinVzm0iJKuCpM9ptXyNQ-DAZaEadQSU-ori2I.JPG',
  'att.wIQt-jwdjmENWAi_9aKZSSMd3ylW5NUBYho3W64e6So.JPG',
  'att.1AjjFPuTCwJmDENd1XkWpabEAKS_j-hcvGTtAdY4HGA.JPG',
]

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <section className="bg-forest-700 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Gallery</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-white">Happy dogs on happy walks</h1>
          <p className="mt-3 max-w-xl text-sm text-white/65">
            Real photos from real walks — because every dog deserves a great adventure.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {IMAGES.map((filename) => (
            <div key={filename} className="mb-4 overflow-hidden rounded-xl break-inside-avoid">
              <Image
                src={`/images/${filename}`}
                alt="Dog walk photo"
                width={600}
                height={600}
                className="w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}
