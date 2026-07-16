'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppSelect } from '@/components/primitives'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useDisposals } from '../hooks/useDisposals'
import { useDisposalMutations } from '../hooks/useDisposalMutations'
import { getDisposalColumns } from './DisposalColumns'
import { DisposalSubmitModal } from './DisposalSubmitModal'
import { DisposalDetailModal } from './DisposalDetailModal'
import { DisposalDTO } from '../types'

export function DisposalModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canCreate = hasPermissionForUser(currentUser, 'disposal:create')

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const { disposalsList, totalPages, assets, loading, refetch } = useDisposals({
    statusFilter,
    page,
    limit,
  })

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [selectedDisposal, setSelectedDisposal] = useState<DisposalDTO | null>(null)

  const { ajukanDisposal, isSubmitting } = useDisposalMutations(() => {
    setIsSubmitOpen(false)
    refetch()
  })

  const columns = getDisposalColumns(setSelectedDisposal)

  return (
    <PageShell title="Penghapusan Aset BMN" description="Ajukan dan pantau persetujuan penghapusan aset negara yang rusak berat atau hilang dari inventaris.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Workflow
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'dalam_proses', label: 'Dalam Proses' },
                { value: 'disetujui', label: 'Disetujui (Selesai)' },
                { value: 'ditolak', label: 'Ditolak' },
              ]}
            />
          </div>
          {canCreate && (
            <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
              Ajukan Penghapusan
            </AppButton>
          )}
        </div>

        <DataTable
          columns={columns}
          data={disposalsList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {isSubmitOpen && (
        <DisposalSubmitModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          assets={assets}
          onSubmit={ajukanDisposal}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedDisposal && (
        <DisposalDetailModal
          disposal={selectedDisposal}
          onClose={() => setSelectedDisposal(null)}
        />
      )}
    </PageShell>
  )
}
