'use client'

import React from 'react'
import { AppModal } from '@/components/primitives'
import { UnitKerjaForm } from './UnitKerjaForm'
import { useUpdateUnitKerja } from '../hooks/useUpdateUnitKerja'
import { unitKerjaMapper } from '../mappers/unit-kerja.mapper'
import { UnitKerjaFormValues } from '../schemas/unit-kerja.schema'
import { UnitKerja } from '../types'

interface EditUnitKerjaModalProps {
  isOpen: boolean
  onClose: () => void
  unit: UnitKerja | null
  onSuccess?: () => void
}

/**
 * Modal for editing existing Unit Kerja
 * Maps unit entity to form values using mapper
 */
export function EditUnitKerjaModal({
  isOpen,
  onClose,
  unit,
  onSuccess,
}: EditUnitKerjaModalProps) {
  const { updateUnitKerja, loading } = useUpdateUnitKerja()

  const handleSubmit = async (values: UnitKerjaFormValues) => {
    if (!unit) return
    try {
      await updateUnitKerja(unit.kode, values)
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handled by hook
    }
  }

  if (!unit) return null

  const formValues = unitKerjaMapper.toFormValues(unit)

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Unit Kerja"
      description={`Memperbarui data unit kerja: ${unit.name}`}
      size="4xl"
    >
      <UnitKerjaForm
        initialValues={formValues}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Perbarui Unit"
        isEdit
      />
    </AppModal>
  )
}