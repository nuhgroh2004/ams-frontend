'use client'

import React from 'react'
import { AppModal } from '@/components/primitives'
import { UnitKerjaForm } from './UnitKerjaForm'
import { useCreateUnitKerja } from '../hooks/useCreateUnitKerja'
import { UnitKerjaFormValues } from '../schemas/unit-kerja.schema'

interface CreateUnitKerjaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Modal for creating new Unit Kerja
 */
export function CreateUnitKerjaModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUnitKerjaModalProps) {
  const { createUnitKerja, loading } = useCreateUnitKerja()

  const handleSubmit = async (values: UnitKerjaFormValues) => {
    try {
      await createUnitKerja(values)
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handled by hook
    }
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Unit Kerja"
      description="Silakan isi formulir di bawah ini untuk menambahkan unit kerja baru."
      size="5xl"
    >
      <UnitKerjaForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Tambah Unit"
        isEdit={false}
      />
    </AppModal>
  )
}
