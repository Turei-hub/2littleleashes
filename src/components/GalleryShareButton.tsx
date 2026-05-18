'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import GalleryUploadModal from './GalleryUploadModal'

export default function GalleryShareButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary">
        <Camera size={15} />
        Share your photo
      </button>
      {open && <GalleryUploadModal onClose={() => setOpen(false)} />}
    </>
  )
}
