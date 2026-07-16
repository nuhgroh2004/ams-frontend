'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppInput, AppSelect } from '@/components/primitives'
import { AssetTable } from './AssetTable'
import { AssetFormModal } from './modals/AssetFormModal'
import { ConfirmActionModal } from '@/modules/users/components/modals/ConfirmActionModal'
import { useAssets } from '../hooks/useAssets'
import { useDeleteAsset } from '../hooks/useAssetMutations'
import { toast } from '@/lib/toast'
import { Asset } from '../types'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'

export function AssetModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate = hasPermissionForUser(currentUser, 'asset:create')
  const canEdit   = hasPermissionForUser(currentUser, 'asset:edit')
  const canDelete = hasPermissionForUser(currentUser, 'asset:delete')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [kondisiFilter, setKondisiFilter] = useState('all')
  
  const [page, setPage] = useState(1)
  const limit = 10

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [assetToDeleteId, setAssetToDeleteId] = useState<string | null>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1)
  }, [statusFilter, kondisiFilter])

  // Prepare filters for API
  const filter: any = {}
  if (debouncedSearch) filter.search = debouncedSearch
  if (statusFilter !== 'all') filter.status_penggunaan = statusFilter
  if (kondisiFilter !== 'all') filter.kondisi = kondisiFilter

  // Query assets
  const { assets, loading, total, totalPages, refetch } = useAssets({
    page,
    limit,
    filter
  })

  // Delete mutation
  const { deleteAsset, loading: isDeleting } = useDeleteAsset()

  const handleAdd = () => {
    setSelectedAsset(null)
    setIsFormOpen(true)
  }

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsFormOpen(true)
  }

  const handleDeleteTrigger = (id: string) => {
    setAssetToDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!assetToDeleteId) return
    try {
      const success = await deleteAsset(assetToDeleteId)
      if (success) {
        toast.success('Aset berhasil dihapus')
        refetch()
      } else {
        toast.error('Gagal menghapus aset')
      }
      setIsConfirmOpen(false)
    } catch (err: any) {
      toast.error('Gagal menghapus aset', err.message)
    }
  }

  return (
    <PageShell 
      title="Manajemen Aset" 
      description="Kelola database aset BMN, detail perolehan, lokasi penempatan, dan penanggung jawab."
    >
      <AssetFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedAsset}
        onSuccess={() => refetch()}
      />

      <ConfirmActionModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Hapus Aset"
        description="Apakah Anda yakin ingin menghapus aset ini secara permanen dari database?"
        type="danger"
        confirmText="Hapus"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Filter and Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-card p-4 rounded-2xl border border-border">
        {/* Search */}
        <div className="md:col-span-4 lg:col-span-5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Pencarian
          </label>
          <AppInput 
            placeholder="Cari nama atau kode aset..."
            icon={Search}
            className="bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Status Penggunaan
          </label>
          <AppSelect 
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'aktif', label: 'Aktif' },
              { value: 'dipinjam', label: 'Dipinjam' },
              { value: 'maintenance', label: 'Perawatan' },
              { value: 'dihapus', label: 'Dihapus' },
              { value: 'hilang', label: 'Hilang' },
            ]}
          />
        </div>

        {/* Kondisi Filter */}
        <div className="md:col-span-3 lg:col-span-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
            Kondisi Aset
          </label>
          <AppSelect 
            value={kondisiFilter}
            onValueChange={setKondisiFilter}
            options={[
              { value: 'all', label: 'Semua Kondisi' },
              { value: 'baik', label: 'Baik' },
              { value: 'rusak_ringan', label: 'Rusak Ringan' },
              { value: 'rusak_berat', label: 'Rusak Berat' },
            ]}
          />
        </div>

        {/* Add Button — asset:create */}
        <div className="md:col-span-2 lg:col-span-3">
          {canCreate && (
            <AppButton 
              fullWidth 
              icon={Plus} 
              variant="primary"
              onClick={handleAdd}
            >
              Tambah Aset
            </AppButton>
          )}
        </div>
      </div>

      {/* Asset Table */}
      <AssetTable 
        assets={assets}
        loading={loading}
        pagination={{
          total,
          page,
          limit,
          totalPages
        }}
        onPageChange={setPage}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDeleteTrigger : undefined}
      />
    </PageShell>
  )
}
