'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus } from 'lucide-react'
import GalleryUploadModal from '@/components/GalleryUploadModal'

export default function AdminGalleryUpload() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg bg-forest-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-forest-600"
      >
        <ImagePlus size={15} />
        Add photo
      </button>

      {open && (
        <GalleryUploadModal
          onClose={() => setOpen(false)}
          endpoint="/api/gallery/admin-upload"
          title="Add a gallery photo"
          subtitle="Photos you add here go live in the gallery immediately."
          successTitle="Photo added!"
          successText="It's live in the gallery now."
          submitLabel="Add photo"
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  )
}
