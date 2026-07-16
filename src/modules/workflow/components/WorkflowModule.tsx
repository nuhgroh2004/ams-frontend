'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import { AppButton, AppCard, AppCardContent, AppModal, AppTextarea } from '@/components/primitives'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { toast } from '@/lib/toast'
import { Check, X, ShieldAlert, Clock, User } from 'lucide-react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'

const GET_PENDING_APPROVALS = gql`
  query GetMyPendingApprovals {
    myPendingApprovals {
      id
      status
      step {
        nama_step
        step_order
        role {
          nama_role
        }
      }
      workflowInstance {
        id
        entity_type
        entity_id
        workflow {
          nama_workflow
          entity_type
          steps {
            id
            step_order
            nama_step
            role {
              nama_role
            }
          }
        }
        approvals {
          id
          step_id
          status
          notes
          approved_at
          approver {
            nama_lengkap
          }
        }
        startedBy {
          nama_lengkap
        }
        started_at
      }
    }
  }
`

const APPROVE_STEP = gql`
  mutation ApproveStep($approvalId: ID!, $notes: String) {
    approveStep(approvalId: $approvalId, notes: $notes) {
      id
      status
    }
  }
`

const REJECT_STEP = gql`
  mutation RejectStep($approvalId: ID!, $notes: String!) {
    rejectStep(approvalId: $approvalId, notes: $notes) {
      id
      status
    }
  }
`

const GET_MUTASI_DETAILS = gql`
  query GetMutasiDetails($id: ID!) {
    mutasi(id: $id) {
      id
      jenis_mutasi
      alasan_mutasi
      asset {
        nama_barang
        nomor_register
      }
      unitAsal {
        nama_unit
      }
      unitTujuan {
        nama_unit
      }
      pjAsal {
        nama_lengkap
      }
      pjTujuan {
        nama_lengkap
      }
    }
  }
`

const GET_DISPOSAL_DETAILS = gql`
  query GetDisposalDetails($id: ID!) {
    disposal(id: $id) {
      id
      alasan_penghapusan
      nilai_penjualan
      asset {
        nama_barang
        nomor_register
      }
    }
  }
`

const GET_LOSS_DETAILS = gql`
  query GetLossDetails($id: ID!) {
    lossReport(id: $id) {
      id
      kronologi
      status_proses
      nilai_ganti_rugi
      asset {
        nama_barang
        nomor_register
      }
    }
  }
`

const GET_LOAN_DETAILS = gql`
  query GetLoanDetails($id: ID!) {
    peminjaman(id: $id) {
      id
      status
      tanggal_pinjam
      tanggal_rencana_kembali
      catatan_pengaju
      asset {
        nama_barang
        nomor_register
      }
      peminjam {
        nama_lengkap
      }
    }
  }
`

export function WorkflowModule() {
  const currentUser = useAuthStore((state) => state.user)
  const canView = hasPermissionForUser(currentUser, 'workflow:view')

  const { data, loading, refetch } = useQuery(GET_PENDING_APPROVALS, {
    fetchPolicy: 'network-only',
    skip: !canView
  })
  const [approveStepMutation, { loading: isApproving }] = useMutation(APPROVE_STEP)
  const [rejectStepMutation, { loading: isRejecting }] = useMutation(REJECT_STEP)

  const [getMutasi, { data: mutasiData, loading: loadingMutasi }] = useLazyQuery(GET_MUTASI_DETAILS, { fetchPolicy: 'network-only' })
  const [getDisposal, { data: disposalData, loading: loadingDisposal }] = useLazyQuery(GET_DISPOSAL_DETAILS, { fetchPolicy: 'network-only' })
  const [getLoss, { data: lossData, loading: loadingLoss }] = useLazyQuery(GET_LOSS_DETAILS, { fetchPolicy: 'network-only' })
  const [getLoan, { data: loanData, loading: loadingLoan }] = useLazyQuery(GET_LOAN_DETAILS, { fetchPolicy: 'network-only' })

  const [selectedApproval, setSelectedApproval] = useState<any | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')

  const pendingList = data?.myPendingApprovals || []

  const handleActionClick = (approval: any, type: 'approve' | 'reject') => {
    setSelectedApproval(approval)
    setActionType(type)
    setNotes('')

    const entityId = approval.workflowInstance.entity_id
    const entityType = approval.workflowInstance.entity_type

    if (entityType === 'mutasi') {
      getMutasi({ variables: { id: entityId } })
    } else if (entityType === 'disposal') {
      getDisposal({ variables: { id: entityId } })
    } else if (entityType === 'loss') {
      getLoss({ variables: { id: entityId } })
    } else if (entityType === 'loan') {
      getLoan({ variables: { id: entityId } })
    }
  }

  const handleConfirm = async () => {
    if (!selectedApproval || !actionType) return

    if (actionType === 'reject' && !notes.trim()) {
      toast.error('Alasan penolakan wajib diisi')
      return
    }

    try {
      if (actionType === 'approve') {
        await approveStepMutation({
          variables: { approvalId: selectedApproval.id, notes },
        })
        toast.success('Persetujuan berhasil dikirim')
      } else {
        await rejectStepMutation({
          variables: { approvalId: selectedApproval.id, notes },
        })
        toast.success('Pengajuan berhasil ditolak')
      }
      refetch()
      setSelectedApproval(null)
      setActionType(null)
    } catch (err: any) {
      toast.error('Gagal memproses persetujuan', err.message)
    }
  }

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
              <AppCard key={app.id} className="hover:shadow-md transition-shadow">
                <AppCardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary w-fit">
                          <Clock className="h-3.5 w-3.5" />
                          Langkah {app.step.step_order}: {app.step.nama_step}
                        </span>
                        {app.step.role?.nama_role && (
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider pl-1">
                            Peran Approver: {app.step.role.nama_role}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {dayjs(app.workflowInstance.started_at).format('YYYY-MM-DD')}
                      </span>
                    </div>

                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-semibold text-base">{app.workflowInstance.workflow?.nama_workflow}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID Pengajuan: <strong className="text-foreground">#{app.workflowInstance.entity_id}</strong>
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.workflowInstance.entity_type === 'mutasi'
                          ? 'bg-blue-500/10 text-blue-500'
                          : app.workflowInstance.entity_type === 'disposal'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : app.workflowInstance.entity_type === 'loan'
                          ? 'bg-purple-500/10 text-purple-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {app.workflowInstance.entity_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Diajukan oleh: <strong className="font-medium">{app.workflowInstance.startedBy?.nama_lengkap || 'User'}</strong>
                      </span>
                    </div>

                    {/* Visual Workflow Steps Progress Timeline */}
                    <div className="border-t border-border/60 pt-4">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 ml-1">
                        Alur Persetujuan ({app.workflowInstance.workflow?.steps?.length || 0} Langkah)
                      </p>
                      
                      <div className="flex flex-col gap-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                        {app.workflowInstance.workflow?.steps?.map((step: any) => {
                          const approvalRecord = app.workflowInstance.approvals?.find(
                            (a: any) => a.step_id === step.id
                          );
                          
                          let isCurrent = app.step.step_order === step.step_order;
                          let isApproved = approvalRecord?.status === 'disetujui';
                          let isRejected = approvalRecord?.status === 'ditolak';
                          
                          let statusText = 'Belum Dimulai';
                          let dotColor = 'bg-muted border-border';
                          let textColor = 'text-muted-foreground';
                          
                          if (isCurrent) {
                            statusText = 'Menunggu Persetujuan Anda';
                            dotColor = 'bg-primary border-primary ring-4 ring-primary/10';
                            textColor = 'text-primary font-semibold';
                          } else if (isApproved) {
                            statusText = `Disetujui oleh ${approvalRecord?.approver?.nama_lengkap || 'Sistem'}`;
                            dotColor = 'bg-green-500 border-green-500';
                            textColor = 'text-foreground font-medium';
                          } else if (isRejected) {
                            statusText = `Ditolak oleh ${approvalRecord?.approver?.nama_lengkap || 'Sistem'}`;
                            dotColor = 'bg-red-500 border-red-500';
                            textColor = 'text-danger font-medium';
                          }
                          
                          return (
                            <div key={step.id} className="relative text-xs flex justify-between items-start gap-4">
                              <span className={cn(
                                "absolute -left-[14.5px] top-1.5 h-2 w-2 rounded-full border-2",
                                dotColor
                              )} />
                              
                              <div className="flex-1">
                                  <p className={cn("text-xs leading-none", textColor)}>
                                    Langkah {step.step_order}: {step.nama_step} {step.role?.nama_role && `(${step.role.nama_role})`}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                                    {statusText}
                                  </p>
                                {approvalRecord?.notes && (
                                  <p className="text-[10px] italic text-muted-foreground bg-muted/20 p-1.5 rounded mt-1 border border-border/40">
                                    Catatan: "{approvalRecord.notes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                    <AppButton
                      variant="outline"
                      fullWidth
                      icon={X}
                      className="border-danger/30 text-danger hover:bg-danger/5"
                      onClick={() => handleActionClick(app, 'reject')}
                    >
                      Tolak
                    </AppButton>
                    <AppButton
                      fullWidth
                      icon={Check}
                      onClick={() => handleActionClick(app, 'approve')}
                    >
                      Setujui
                    </AppButton>
                  </div>
                </AppCardContent>
              </AppCard>
            ))}
          </div>
        )}
      </div>

      {selectedApproval && (
        <AppModal
          isOpen={!!selectedApproval}
          onClose={() => {
            setSelectedApproval(null)
            setActionType(null)
          }}
          title={actionType === 'approve' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
        >
          <div className="space-y-4 pt-3">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin {actionType === 'approve' ? 'menyetujui' : 'menolak'} langkah{' '}
              <strong>"{selectedApproval.step.nama_step}"</strong> untuk pengajuan ini?
            </p>

            {/* Detailed Proposal View */}
            <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-3">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Detail Usulan</h5>
              {loadingMutasi || loadingDisposal || loadingLoss || loadingLoan ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {selectedApproval.workflowInstance.entity_type === 'mutasi' && mutasiData?.mutasi && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Jenis Mutasi</span>
                        <span className="font-semibold capitalize text-foreground">{mutasiData.mutasi.jenis_mutasi}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Nama Aset</span>
                        <span className="font-semibold text-foreground">{mutasiData.mutasi.asset.nama_barang} ({mutasiData.mutasi.asset.nomor_register || '-'})</span>
                      </div>
                      {mutasiData.mutasi.unitAsal && (
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Unit Asal</span>
                          <span className="font-medium text-foreground">{mutasiData.mutasi.unitAsal.nama_unit}</span>
                        </div>
                      )}
                      {mutasiData.mutasi.unitTujuan && (
                        <div>
                          <span className="text-[11px] text-muted-foreground block">Unit Tujuan</span>
                          <span className="font-medium text-foreground">{mutasiData.mutasi.unitTujuan.nama_unit}</span>
                        </div>
                      )}
                      {mutasiData.mutasi.pjAsal && (
                        <div>
                          <span className="text-[11px] text-muted-foreground block">PJ Asal</span>
                          <span className="font-medium text-foreground">{mutasiData.mutasi.pjAsal.nama_lengkap}</span>
                        </div>
                      )}
                      {mutasiData.mutasi.pjTujuan && (
                        <div>
                          <span className="text-[11px] text-muted-foreground block">PJ Tujuan</span>
                          <span className="font-medium text-foreground">{mutasiData.mutasi.pjTujuan.nama_lengkap}</span>
                        </div>
                      )}
                      <div className="col-span-2 border-t border-border pt-2.5 mt-1">
                        <span className="text-[11px] text-muted-foreground block">Alasan Mutasi</span>
                        <p className="mt-1 text-xs text-foreground italic bg-background/50 p-2.5 rounded-lg border border-border/50">
                          "{mutasiData.mutasi.alasan_mutasi}"
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApproval.workflowInstance.entity_type === 'disposal' && disposalData?.disposal && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <span className="text-[11px] text-muted-foreground block">Nama Aset</span>
                        <span className="font-semibold text-foreground">{disposalData.disposal.asset.nama_barang} ({disposalData.disposal.asset.nomor_register || '-'})</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Estimasi Nilai Jual/Lelang</span>
                        <span className="font-semibold text-foreground">
                          {disposalData.disposal.nilai_penjualan ? `Rp ${parseFloat(disposalData.disposal.nilai_penjualan).toLocaleString()}` : '-'}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-border pt-2.5 mt-1">
                        <span className="text-[11px] text-muted-foreground block">Alasan Penghapusan</span>
                        <p className="mt-1 text-xs text-foreground italic bg-background/50 p-2.5 rounded-lg border border-border/50">
                          "{disposalData.disposal.alasan_penghapusan}"
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApproval.workflowInstance.entity_type === 'loss' && lossData?.lossReport && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <span className="text-[11px] text-muted-foreground block">Nama Aset</span>
                        <span className="font-semibold text-foreground">{lossData.lossReport.asset.nama_barang} ({lossData.lossReport.asset.nomor_register || '-'})</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Nilai Tuntutan Ganti Rugi</span>
                        <span className="font-semibold text-danger">
                          {lossData.lossReport.nilai_ganti_rugi ? `Rp ${parseFloat(lossData.lossReport.nilai_ganti_rugi).toLocaleString()}` : 'Belum Ditetapkan'}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-border pt-2.5 mt-1">
                        <span className="text-[11px] text-muted-foreground block">Kronologi</span>
                        <p className="mt-1 text-xs text-foreground italic bg-background/50 p-2.5 rounded-lg border border-border/50">
                          "{lossData.lossReport.kronologi}"
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedApproval.workflowInstance.entity_type === 'loan' && loanData?.peminjaman && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <span className="text-[11px] text-muted-foreground block">Nama Aset</span>
                        <span className="font-semibold text-foreground">{loanData.peminjaman.asset.nama_barang} ({loanData.peminjaman.asset.nomor_register || '-'})</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Peminjam</span>
                        <span className="font-semibold text-foreground">{loanData.peminjaman.peminjam?.nama_lengkap || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Rencana Kembali</span>
                        <span className="font-semibold text-foreground">
                          {dayjs(loanData.peminjaman.tanggal_rencana_kembali).format('YYYY-MM-DD')}
                        </span>
                      </div>
                      <div className="col-span-2 border-t border-border pt-2.5 mt-1">
                        <span className="text-[11px] text-muted-foreground block">Catatan Pengaju</span>
                        <p className="mt-1 text-xs text-foreground italic bg-background/50 p-2.5 rounded-lg border border-border/50">
                          "{loanData.peminjaman.catatan_pengaju || 'Tidak ada catatan'}"
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
                Catatan / Alasan {actionType === 'reject' && <span className="text-danger">*</span>}
              </label>
              <AppTextarea
                placeholder={actionType === 'approve' ? 'Tulis catatan persetujuan (opsional)...' : 'Tulis alasan penolakan (wajib)...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <AppButton
                variant="outline"
                onClick={() => {
                  setSelectedApproval(null)
                  setActionType(null)
                }}
              >
                Batal
              </AppButton>
              <AppButton
                variant={actionType === 'reject' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                isLoading={isApproving || isRejecting}
              >
                Konfirmasi
              </AppButton>
            </div>
          </div>
        </AppModal>
      )}
    </PageShell>
  )
}
