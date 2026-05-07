'use client'

import React from 'react'
import { AppModal, AppButton } from '@/components/primitives'
import { useDeleteUnitKerja } from '../hooks/useDeleteUnitKerja'
import { UnitKerja } from '../types'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteUnitKerjaDialogProps {
  isOpen: boolean
  onClose: () => void
  unit: UnitKerja | null
  onSuccess?: () => void
}

/**
 * Delete confirmation dialog for Unit Kerja
 */
export function DeleteUnitKerjaDialog({
  isOpen,
  onClose,
  unit,
  onSuccess,
}: DeleteUnitKerjaDialogProps) {
  const { deleteUnitKerja, loading } = useDeleteUnitKerja()

  const handleDelete = async () => {
    if (!unit) return
    try {
      await deleteUnitKerja(unit.kode)
      onSuccess?.()
      onClose()
    } catch (error) {
      // Error handled by hook
    }
  }

  if (!unit) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Unit Kerja"
      description="Konfirmasi penghapusan data"
      size="sm"
      className="w-[95%]"
    >
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Apakah Anda yakin?</p>
            <p className="text-xs text-muted-foreground">
              Unit kerja{' '}
              <span className="font-bold text-foreground">{unit.name}</span> akan
              dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </AppButton>
          <AppButton
            variant="danger"
            onClick={handleDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Hapus...
              </>
            ) : (
              'Hapus Unit'
            )}
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
