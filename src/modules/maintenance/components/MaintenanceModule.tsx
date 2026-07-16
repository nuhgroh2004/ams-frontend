'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppSelect } from '@/components/primitives'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useMaintenance } from '../hooks/useMaintenance'
import { useMaintenanceMutations } from '../hooks/useMaintenanceMutations'
import { getMaintenanceColumns } from './MaintenanceColumns'
import { MaintenanceSubmitModal } from './MaintenanceSubmitModal'
import { MaintenanceFinishModal } from './MaintenanceFinishModal'

export function MaintenanceModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate   = hasPermissionForUser(currentUser, 'maintenance:create')
  const canComplete = hasPermissionForUser(currentUser, 'maintenance:complete')

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const { records, totalPages, assets, loading, refetch } = useMaintenance({
    statusFilter,
    page,
    limit,
  })

  const { createMaintenance, startMaintenance, finishMaintenance } = useMaintenanceMutations(refetch)

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isFinishOpen, setIsFinishOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  const handleFinishClick = (id: string) => {
    setSelectedRecordId(id)
    setIsFinishOpen(true)
  }

  const handleFinishConfirm = async (biayaReal: string, kondisiSetelah: string) => {
    if (!selectedRecordId) return false
    const success = await finishMaintenance(selectedRecordId, biayaReal, kondisiSetelah)
    if (success) {
      setIsFinishOpen(false)
      setSelectedRecordId(null)
    }
    return success
  }

  const columns = getMaintenanceColumns({
    canCreate,
    canComplete,
    onStart: startMaintenance,
    onFinishClick: handleFinishClick,
  })

  return (
    <PageShell title="Perawatan Aset" description="Jadwalkan dan catat riwayat pemeliharaan serta perbaikan aset.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'pengajuan', label: 'Pengajuan' },
                { value: 'proses', label: 'Dalam Proses' },
                { value: 'selesai', label: 'Selesai' },
                { value: 'batal', label: 'Batal' },
              ]}
            />
          </div>
          {canCreate && (
            <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
              Ajukan Perawatan
            </AppButton>
          )}
        </div>

        <DataTable
          columns={columns}
          data={records}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {isSubmitOpen && (
        <MaintenanceSubmitModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          assets={assets}
          onSubmit={createMaintenance}
        />
      )}

      {isFinishOpen && (
        <MaintenanceFinishModal
          isOpen={isFinishOpen}
          onClose={() => setIsFinishOpen(false)}
          onSubmit={handleFinishConfirm}
        />
      )}
    </PageShell>
  )
}
