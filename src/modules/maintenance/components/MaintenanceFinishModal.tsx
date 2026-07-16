import React, { useState } from 'react'
import { AppModal, AppButton, AppSelect, AppInput } from '@/components/primitives'

interface MaintenanceFinishModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (biayaReal: string, kondisiSetelah: string) => Promise<boolean>
}

export function MaintenanceFinishModal({
  isOpen,
  onClose,
  onSubmit,
}: MaintenanceFinishModalProps) {
  const [biayaReal, setBiayaReal] = useState('')
  const [kondisiSetelah, setKondisiSetelah] = useState('baik')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(biayaReal, kondisiSetelah)
    setIsSubmitting(false)
    if (success) {
      setBiayaReal('')
      setKondisiSetelah('baik')
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Selesaikan Perawatan">
      <div className="space-y-4 pt-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Biaya Riil (Rp)</label>
          <AppInput
            type="number"
            placeholder="Masukkan biaya aktual yang dikeluarkan..."
            value={biayaReal}
            onChange={(e) => setBiayaReal(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Kondisi Aset Pasca Perbaikan</label>
          <AppSelect
            value={kondisiSetelah}
            onValueChange={setKondisiSetelah}
            options={[
              { value: 'baik', label: 'Baik' },
              { value: 'rusak_ringan', label: 'Rusak Ringan' },
              { value: 'rusak_berat', label: 'Rusak Berat' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton onClick={handleConfirm} isLoading={isSubmitting}>Konfirmasi Selesai</AppButton>
        </div>
      </div>
    </AppModal>
  )
}
