'use client'

import React from 'react'
import { PageShell } from '@/components/patterns'
import { AppCard, AppCardContent } from '@/components/primitives'
import { ShieldAlert } from 'lucide-react'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useWorkflow } from '../hooks/useWorkflow'
import { WorkflowCard } from './WorkflowCard'
import { WorkflowActionModal } from './WorkflowActionModal'

export function WorkflowModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canView = hasPermissionForUser(currentUser, 'workflow:view')

  const {
    pendingList,
    loading,
    selectedApproval,
    actionType,
    notes,
    setNotes,
    mutasiData,
    loadingMutasi,
    disposalData,
    loadingDisposal,
    lossData,
    loadingLoss,
    loanData,
    loadingLoan,
    handleActionClick,
    handleConfirm,
    handleCloseAction,
  } = useWorkflow(canView)

  if (!canView) {
    return (
      <PageShell
        title="Kotak Masuk Persetujuan"
        description="Akses ditolak."
      >
        <AppCard variant="alert">
          <AppCardContent className="flex items-center gap-3 pt-5 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <p className="text-sm font-medium">Anda tidak memiliki izin untuk melihat kotak masuk persetujuan.</p>
          </AppCardContent>
        </AppCard>
      </PageShell>
    )
  }

  const loadingDetails = loadingMutasi || loadingDisposal || loadingLoss || loadingLoan

  return (
    <PageShell
      title="Kotak Masuk Persetujuan"
      description="Tinjau dan setujui usulan mutasi, penghapusan, atau kehilangan aset BMN."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pendingList.length === 0 ? (
          <AppCard variant="alert">
            <AppCardContent className="flex items-center gap-3 pt-5">
              <ShieldAlert className="h-5 w-5 text-success" />
              <p className="text-sm font-medium">Kotak masuk bersih! Tidak ada pengajuan yang menunggu persetujuan Anda.</p>
            </AppCardContent>
          </AppCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingList.map((app: any) => (
              <WorkflowCard
                key={app.id}
                app={app}
                onAction={handleActionClick}
              />
            ))}
          </div>
        )}
      </div>

      {selectedApproval && actionType && (
        <WorkflowActionModal
          isOpen={!!selectedApproval}
          onClose={handleCloseAction}
          actionType={actionType}
          notes={notes}
          setNotes={setNotes}
          onConfirm={handleConfirm}
          loadingDetails={loadingDetails}
          mutasiData={mutasiData}
          disposalData={disposalData}
          lossData={lossData}
          loanData={loanData}
          selectedApproval={selectedApproval}
        />
      )}
    </PageShell>
  )
}
export default WorkflowModule
