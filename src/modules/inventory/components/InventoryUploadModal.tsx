import React, { useState } from 'react'
import { AppModal, AppButton } from '@/components/primitives'
import { ShieldAlert } from 'lucide-react'

interface InventoryUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (file: File | null) => Promise<boolean>
}

export function InventoryUploadModal({ isOpen, onClose, onSubmit }: InventoryUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(file)
    setIsSubmitting(false)
    if (success) {
      setFile(null)
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Upload Berita Acara Serah Terima">
      <div className="space-y-4 pt-3">
        <div className="p-4 rounded-xl bg-warning/5 border border-warning/10 flex gap-3 text-warning">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            Menyelesaikan stock opname akan memperbarui status fisik seluruh aset di database dan mengunci checklist ini.
            Anda wajib mengunggah file Berita Acara yang telah ditandatangani.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Dokumen PDF BAST</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton onClick={handleConfirm} isLoading={isSubmitting}>Selesaikan</AppButton>
        </div>
      </div>
    </AppModal>
  )
}
