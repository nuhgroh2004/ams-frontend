import React, { useState } from 'react'
import { AppModal, AppButton, AppSelect, AppInput, AppTextarea } from '@/components/primitives'
import { AssetSimple } from '../types'

interface DisposalSubmitModalProps {
  isOpen: boolean
  onClose: () => void
  assets: AssetSimple[]
  onSubmit: (assetId: string, alasan: string, nilaiPenjualan: string, file: File | null) => Promise<boolean>
  isSubmitting: boolean
}

export function DisposalSubmitModal({
  isOpen,
  onClose,
  assets,
  onSubmit,
  isSubmitting,
}: DisposalSubmitModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState('')
  const [alasan, setAlasan] = useState('')
  const [nilaiPenjualan, setNilaiPenjualan] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFormSubmit = async () => {
    const success = await onSubmit(selectedAssetId, alasan, nilaiPenjualan, file)
    if (success) {
      setSelectedAssetId('')
      setAlasan('')
      setNilaiPenjualan('')
      setFile(null)
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Ajukan Usulan Penghapusan BMN">
      <div className="space-y-4 pt-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Aset</label>
          <AppSelect
            value={selectedAssetId}
            onValueChange={setSelectedAssetId}
            options={[
              { value: '', label: 'Pilih aset...' },
              ...assets.map((a) => ({
                value: a.id,
                label: `${a.nama_barang} (${a.nomor_register || '-'})`,
              })),
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Alasan Penghapusan</label>
          <AppTextarea
            placeholder="Tulis alasan logis pemusnahan atau penghapusan aset (misal: rusak berat & tidak bernilai ekonomis)..."
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Perkiraan Nilai Jual/Lelang (Rp) (Opsional)</label>
          <AppInput
            type="number"
            placeholder="0"
            value={nilaiPenjualan}
            onChange={(e) => setNilaiPenjualan(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Dokumen Justifikasi (PDF/Gambar)</label>
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
          <AppButton onClick={handleFormSubmit} isLoading={isSubmitting}>
            Ajukan Usulan
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
