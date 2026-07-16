'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppSelect } from '@/components/primitives'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useInventory } from '../hooks/useInventory'
import { useInventoryMutations } from '../hooks/useInventoryMutations'
import { getInventoryColumns } from './InventoryColumns'
import { InventoryCreateModal } from './InventoryCreateModal'
import { InventoryChecklistModal } from './InventoryChecklistModal'
import { InventoryUploadModal } from './InventoryUploadModal'

export function InventoryModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate   = hasPermissionForUser(currentUser, 'inventory:create')
  const canEdit     = hasPermissionForUser(currentUser, 'inventory:edit')
  const canSignBAST = hasPermissionForUser(currentUser, 'inventory:bast')

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null)

  const {
    inventoriesList,
    totalPages,
    units,
    usersList,
    detailData,
    loading,
    loadingDetails,
    refetch,
    refetchDetails,
  } = useInventory({
    statusFilter,
    page,
    limit,
    selectedInventoryId,
  })

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isChecklistOpen, setIsChecklistOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const { createInventorySchedule, updateInventoryDetail, completeInventory } = useInventoryMutations(
    () => {
      setIsCreateOpen(false)
      refetch()
    },
    () => {
      refetchDetails()
    }
  )

  const handleOpenChecklist = (id: string) => {
    setSelectedInventoryId(id)
    setIsChecklistOpen(true)
  }

  const handleVerify = (assetId: string, statusFisik: string) => {
    if (!selectedInventoryId) return
    updateInventoryDetail(selectedInventoryId, assetId, statusFisik)
  }

  const handleUploadBASTConfirm = async (file: File | null) => {
    if (!selectedInventoryId) return false
    const success = await completeInventory(selectedInventoryId, file)
    if (success) {
      setIsUploadOpen(false)
      setIsChecklistOpen(false)
      setSelectedInventoryId(null)
      refetch()
    }
    return success
  }

  const columns = getInventoryColumns({ onOpenChecklist: handleOpenChecklist })

  return (
    <PageShell title="Inventarisasi Aset (Stock Opname)" description="Jadwalkan stock opname dan lakukan verifikasi fisik aset secara berkala.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Opname
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val)
                setPage(1)
              }}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'proses', label: 'Dalam Proses' },
                { value: 'selesai', label: 'Selesai' },
              ]}
            />
          </div>
          {canCreate && (
            <AppButton icon={Plus} onClick={() => setIsCreateOpen(true)}>
              Buat Jadwal Opname
            </AppButton>
          )}
        </div>

        <DataTable
          columns={columns}
          data={inventoriesList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {isCreateOpen && (
        <InventoryCreateModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          units={units}
          users={usersList}
          onSubmit={createInventorySchedule}
        />
      )}

      {isChecklistOpen && (
        <InventoryChecklistModal
          isOpen={isChecklistOpen}
          onClose={() => {
            setIsChecklistOpen(false)
            setSelectedInventoryId(null)
          }}
          detailData={detailData}
          loadingDetails={loadingDetails}
          canEdit={canEdit}
          canSignBAST={canSignBAST}
          onVerify={handleVerify}
          onCompleteClick={() => setIsUploadOpen(true)}
        />
      )}

      {isUploadOpen && (
        <InventoryUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSubmit={handleUploadBASTConfirm}
        />
      )}
    </PageShell>
  )
}
