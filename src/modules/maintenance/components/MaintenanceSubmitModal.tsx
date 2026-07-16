import React, { useState } from 'react'
import { AppModal, AppButton, AppSelect, AppInput, AppTextarea } from '@/components/primitives'
import { AssetSimple } from '../types'

interface MaintenanceSubmitModalProps {
  isOpen: boolean
  onClose: () => void
  assets: AssetSimple[]
  onSubmit: (assetId: string, jenisPerawatan: string, estimasiBiaya: string, deskripsi: string) => Promise<boolean>
}

export function MaintenanceSubmitModal({
  isOpen,
  onClose,
  assets,
  onSubmit,
}: MaintenanceSubmitModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [jenisPerawatan, setJenisPerawatan] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [estimasiBiaya, setEstimasiBiaya] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(selectedAssetId, jenisPerawatan, estimasiBiaya, deskripsi)
    setIsSubmitting(false)
    if (success) {
      setSelectedAssetId('')
      setJenisPerawatan('')
      setDeskripsi('')
      setEstimasiBiaya('')
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Ajukan Perawatan Baru">
      <div className="space-y-4 pt-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset</label>
          <AppSelect
            value={selectedAssetId}
            onValueChange={setSelectedAssetId}
            options={[
              { value: '', label: 'Pilih aset yang ingin dirawat...' },
              ...assets.map((a: any) => ({
                value: a.id,
                label: `${a.nama_barang} (${a.nomor_register || '-'})`,
              })),
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Jenis Perawatan</label>
          <AppInput
            placeholder="Misal: Ganti Oli, Perbaikan Layar LCD, Service AC..."
            value={jenisPerawatan}
            onChange={(e) => setJenisPerawatan(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Estimasi Biaya (Rp)</label>
          <AppInput
            type="number"
            placeholder="150000"
            value={estimasiBiaya}
            onChange={(e) => setEstimasiBiaya(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Deskripsi / Keluhan</label>
          <AppTextarea
            placeholder="Jelaskan detail keluhan atau alasan perawatan dilakukan..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton onClick={handleFormSubmit} isLoading={isSubmitting}>Kirim Pengajuan</AppButton>
        </div>
      </div>
    </AppModal>
  )
}
