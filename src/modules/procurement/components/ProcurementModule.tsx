'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppInput } from '@/components/primitives'
import { ProcurementTable } from './ProcurementTable'
import { ProcurementFormModal } from './modals/ProcurementFormModal'
import { ProcurementDetailModal } from './modals/ProcurementDetailModal'
import { ConfirmActionModal } from '@/modules/users/components/modals/ConfirmActionModal'
import { useProcurements, useDeleteProcurement } from '../hooks/useProcurement'
import { toast } from '@/lib/toast'
import { Procurement } from '../types'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'

export function ProcurementModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate = hasPermissionForUser(currentUser, 'procurement:create')
  const canDelete = hasPermissionForUser(currentUser, 'procurement:delete')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedProcurement, setSelectedProcurement] = useState<Procurement | null>(null)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [procurementToDeleteId, setProcurementToDeleteId] = useState<string | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const { procurements, loading, total, totalPages, refetch } = useProcurements({
    page,
    limit,
    search: debouncedSearch
  })

  const { deleteProcurement, loading: isDeleting } = useDeleteProcurement()

  const handleAdd = () => {
    setIsFormOpen(true)
  }

  const handleViewDetails = (procurement: Procurement) => {
    setSelectedProcurement(procurement)
    setIsDetailOpen(true)
  }

  const handleDeleteTrigger = (id: string) => {
    setProcurementToDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!procurementToDeleteId) return
    try {
      const success = await deleteProcurement(procurementToDeleteId)
      if (success) {
        toast.success('Transaksi pengadaan berhasil dihapus')
        refetch()
      } else {
        toast.error('Gagal menghapus transaksi pengadaan')
      }
      setIsConfirmOpen(false)
    } catch (err: any) {
      toast.error('Gagal menghapus pengadaan', err.message)
    }
  }

  return (
    <PageShell 
      title="Pengadaan Aset (Procurement)" 
      description="Monitor dan catat riwayat pengadaan aset BMN, spk kontrak vendor, beserta rincian item logistik."
    >
      <ProcurementFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => refetch()}
      />

      <ProcurementDetailModal 
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedProcurement(null)
        }}
        procurement={selectedProcurement}
      />

      <ConfirmActionModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Hapus Transaksi Pengadaan"
        description="Apakah Anda yakin ingin menghapus catatan pengadaan ini? Semua data item terkait di dalamnya juga akan terhapus."
        type="danger"
        confirmText="Hapus"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Filter and Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-card p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="md:col-span-9 lg:col-span-9">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Pencarian
          </label>
          <AppInput 
            placeholder="Cari nomor pengadaan atau vendor..."
            icon={Search}
            className="bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Button — procurement:create */}
        <div className="md:col-span-3 lg:col-span-3">
          {canCreate && (
            <AppButton 
              fullWidth 
              icon={Plus} 
              variant="primary"
              onClick={handleAdd}
            >
              Catat Pengadaan
            </AppButton>
          )}
        </div>
      </div>

      {/* Procurement Table */}
      <ProcurementTable 
        procurements={procurements}
        loading={loading}
        pagination={{
          total,
          page,
          limit,
          totalPages
        }}
        onPageChange={setPage}
        onViewDetails={handleViewDetails}
        onDelete={canDelete ? handleDeleteTrigger : undefined}
      />
    </PageShell>
  )
}
