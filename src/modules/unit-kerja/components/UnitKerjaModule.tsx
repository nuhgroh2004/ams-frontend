'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppInput, AppCard } from '@/components/primitives'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { useUnitKerjaList } from '../hooks/useUnitKerjaList'
import { UnitKerjaTable } from './UnitKerjaTable'
import { CreateUnitKerjaModal } from './CreateUnitKerjaModal'
import { EditUnitKerjaModal } from './EditUnitKerjaModal'
import { DeleteUnitKerjaDialog } from './DeleteUnitKerjaDialog'
import { UnitKerja } from '../types'

/**
 * Unit Kerja Management Module
 * Complete CRUD interface for managing organizational units with hierarchy support
 */
export function UnitKerjaModule() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<UnitKerja | null>(null)
  const [deletingUnit, setDeletingUnit] = useState<UnitKerja | null>(null)

  const { unitKerjas, pagination, loading, refetch } = useUnitKerjaList({
    page,
    search,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleRefresh = async () => {
    await refetch()
  }

  return (
    <PageShell
      title="Manajemen Unit Kerja"
      description="Kelola struktur departemen dan unit kerja organisasi secara efisien."
    >
      <div className="space-y-6">
        {/* Action Bar Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-card p-4 rounded-lg border border-border items-end">
          {/* Search Input */}
          <div className="md:col-span-8 lg:col-span-9">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1 mb-2 block">
              Pencarian
            </label>
            <AppInput
              placeholder="Cari nama atau kode unit kerja..."
              icon={Search}
              className="bg-background/50"
              value={search}
              onChange={handleSearch}
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-4 lg:col-span-3 flex gap-2">
            <AppButton
              variant="secondary"
              size="icon"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </AppButton>
            <AppButton
              fullWidth
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              Tambah Unit
            </AppButton>
          </div>
        </div>

        {/* Table View */}
        <UnitKerjaTable
          data={unitKerjas}
          loading={loading}
          pageCount={pagination.totalPages}
          onPageChange={setPage}
          onEdit={setEditingUnit}
          onDelete={setDeletingUnit}
        />
      </div>

      {/* Modals and Dialogs */}
      <CreateUnitKerjaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditUnitKerjaModal
        isOpen={!!editingUnit}
        onClose={() => setEditingUnit(null)}
        unit={editingUnit}
        onSuccess={() => refetch()}
      />

      <DeleteUnitKerjaDialog
        isOpen={!!deletingUnit}
        onClose={() => setDeletingUnit(null)}
        unit={deletingUnit}
        onSuccess={() => refetch()}
      />
    </PageShell>
  )
}
