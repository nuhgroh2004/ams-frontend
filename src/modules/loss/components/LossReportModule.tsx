'use client'

import React, { useState } from 'react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppButton, AppSelect } from '@/components/primitives'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useLossReports } from '../hooks/useLossReports'
import { useLossReportMutations } from '../hooks/useLossReportMutations'
import { getLossReportColumns } from './LossReportColumns'
import { LossReportSubmitModal } from './LossReportSubmitModal'
import { LossReportTGRModal } from './LossReportTGRModal'
import { LossReportDetailModal } from './LossReportDetailModal'
import { LossReportDTO } from '../types'

export function LossReportModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canReport  = hasPermissionForUser(currentUser, 'loss:report')
  const canApproveLoss = hasPermissionForUser(currentUser, 'loss:approve')

  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const limit = 10

  const { lossList, totalPages, assets, loading, refetch } = useLossReports({
    statusFilter,
    page,
    limit,
  })

  const { ajukanKehilangan, prosesTGR, selesaikanKehilangan } = useLossReportMutations(refetch)

  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isTGROpen, setIsTGROpen] = useState(false)
  const [selectedLoss, setSelectedLoss] = useState<LossReportDTO | null>(null)

  const handleTGRClick = (loss: LossReportDTO) => {
    setSelectedLoss(loss)
    setIsTGROpen(true)
  }

  const handleTGRConfirm = async (nilaiGantiRugi: string) => {
    if (!selectedLoss) return false
    const success = await prosesTGR(selectedLoss.id, nilaiGantiRugi)
    if (success) {
      setIsTGROpen(false)
      setSelectedLoss(null)
    }
    return success
  }

  const handleDetailClose = () => {
    setSelectedLoss(null)
  }

  const columns = getLossReportColumns({
    canApproveLoss,
    onTGR: handleTGRClick,
    onComplete: selesaikanKehilangan,
    onDetail: setSelectedLoss,
  })

  return (
    <PageShell title="Laporan Kehilangan Aset BMN" description="Laporkan aset negara yang hilang dan proses tuntutan ganti rugi (TGR) sesuai peraturan yang berlaku.">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-card p-4 rounded-2xl border border-border">
          <div className="w-full md:w-64">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Status Kasus
            </label>
            <AppSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'lapor', label: 'Laporan Baru' },
                { value: 'proses_tgr', label: 'Tuntutan Ganti Rugi (TGR)' },
                { value: 'selesai', label: 'Selesai' },
              ]}
            />
          </div>
          {canReport && (
            <AppButton icon={Plus} onClick={() => setIsSubmitOpen(true)}>
              Lapor Kehilangan
            </AppButton>
          )}
        </div>

        <DataTable
          columns={columns}
          data={lossList}
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>

      {isSubmitOpen && (
        <LossReportSubmitModal
          isOpen={isSubmitOpen}
          onClose={() => setIsSubmitOpen(false)}
          assets={assets}
          onSubmit={ajukanKehilangan}
        />
      )}

      {isTGROpen && (
        <LossReportTGRModal
          isOpen={isTGROpen}
          onClose={() => { setIsTGROpen(false); setSelectedLoss(null); }}
          onSubmit={handleTGRConfirm}
        />
      )}

      {selectedLoss && !isTGROpen && (
        <LossReportDetailModal
          loss={selectedLoss}
          onClose={handleDetailClose}
        />
      )}
    </PageShell>
  )
}
export function LossModule() {
  return <LossReportModule />
}
