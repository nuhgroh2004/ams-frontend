import React, { useState } from 'react'
import { AppModal, AppButton, AppInput } from '@/components/primitives'
import { AlertTriangle } from 'lucide-react'

interface LossReportTGRModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (nilaiGantiRugi: string) => Promise<boolean>
}

export function LossReportTGRModal({
  isOpen,
  onClose,
  onSubmit,
}: LossReportTGRModalProps) {
  const [nilaiGantiRugi, setNilaiGantiRugi] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(nilaiGantiRugi)
    setIsSubmitting(false)
    if (success) {
      setNilaiGantiRugi('')
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Proses Tuntutan Ganti Rugi (TGR)">
      <div className="space-y-4 pt-3">
        <div className="p-4 rounded-xl bg-danger/5 border border-danger/10 flex gap-3 text-danger">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">
            Peringatan: Tentukan nilai ganti rugi (TGR) yang wajib dibayarkan oleh personel penanggung jawab atas hilangnya barang milik negara.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Nilai Ganti Rugi (Rp)</label>
          <AppInput
            type="number"
            placeholder="Masukkan besaran tuntutan nominal..."
            value={nilaiGantiRugi}
            onChange={(e) => setNilaiGantiRugi(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton variant="danger" onClick={handleConfirm} isLoading={isSubmitting}>
            Terapkan TGR
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
