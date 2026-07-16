import React, { useState } from 'react'
import { AppModal, AppButton, AppSelect, AppInput } from '@/components/primitives'
import { UnitSimple, UserSimple } from '../types'

interface InventoryCreateModalProps {
  isOpen: boolean
  onClose: () => void
  units: UnitSimple[]
  users: UserSimple[]
  onSubmit: (unitId: string, startDate: string, endDate: string, picId: string) => Promise<boolean>
}

export function InventoryCreateModal({
  isOpen,
  onClose,
  units,
  users,
  onSubmit,
}: InventoryCreateModalProps) {
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [picId, setPicId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSubmit = async () => {
    setIsSubmitting(true)
    const success = await onSubmit(selectedUnitId, startDate, endDate, picId)
    setIsSubmitting(false)
    if (success) {
      setSelectedUnitId('')
      setStartDate('')
      setEndDate('')
      setPicId('')
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Jadwalkan Stock Opname">
      <div className="space-y-4 pt-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Pilih Unit Kerja</label>
          <AppSelect
            value={selectedUnitId}
            onValueChange={setSelectedUnitId}
            options={[
              { value: '', label: 'Pilih unit...' },
              ...units.map((u) => ({ value: u.id, label: u.nama_unit })),
            ]}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Penanggung Jawab (PIC)</label>
          <AppSelect
            value={picId}
            onValueChange={setPicId}
            options={[
              { value: '', label: 'Pilih PIC...' },
              ...users.map((u) => ({ value: u.id, label: u.nama_lengkap })),
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Tanggal Mulai</label>
            <AppInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Tanggal Selesai</label>
            <AppInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton onClick={handleFormSubmit} isLoading={isSubmitting}>Simpan Jadwal</AppButton>
        </div>
      </div>
    </AppModal>
  )
}
