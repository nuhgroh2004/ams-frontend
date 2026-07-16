import React, { useState } from 'react'
import { AppModal, AppButton, AppSelect, AppTextarea } from '@/components/primitives'
import { AssetSimple } from '../types'

interface LossReportSubmitModalProps {
  isOpen: boolean
  onClose: () => void
  assets: AssetSimple[]
  onSubmit: (assetId: string, kronologi: string, file: File | null) => Promise<boolean>
}

export function LossReportSubmitModal({
  isOpen,
  onClose,
  assets,
  onSubmit,
}: LossReportSubmitModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [kronologi, setKronologi] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(selectedAssetId, kronologi, file)
    setIsSubmitting(false)
    if (success) {
      setSelectedAssetId('')
      setKronologi('')
      setFile(null)
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Buat Laporan Kehilangan BMN">
      <div className="space-y-4 pt-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset yang Hilang</label>
          <AppSelect
            value={selectedAssetId}
            onValueChange={setSelectedAssetId}
            options={[
              { value: '', label: 'Pilih aset...' },
              ...assets.map((a: any) => ({
                value: a.id,
                label: `${a.nama_barang} (${a.nomor_register || '-'})`,
              })),
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Kronologi Kejadian</label>
          <AppTextarea
            placeholder="Tuliskan tempat kejadian, tanggal, dan kronologi hilangnya aset secara jelas..."
            value={kronologi}
            onChange={(e) => setKronologi(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Surat Laporan / Bukti Pendukung (Opsional)</label>
          <input
            type="file"
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton onClick={handleFormSubmit} isLoading={isSubmitting}>Kirim Laporan</AppButton>
        </div>
      </div>
    </AppModal>
  )
}
