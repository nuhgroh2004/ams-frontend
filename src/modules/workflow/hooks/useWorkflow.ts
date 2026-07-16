import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useState } from 'react'
import { toast } from '@/lib/toast'
import {
  GET_PENDING_APPROVALS,
  APPROVE_STEP,
  REJECT_STEP,
  GET_MUTASI_DETAILS,
  GET_DISPOSAL_DETAILS,
  GET_LOSS_DETAILS,
  GET_LOAN_DETAILS,
} from '../services'

export function useWorkflow(canView: boolean) {
  const { data, loading, refetch } = useQuery(GET_PENDING_APPROVALS, {
    fetchPolicy: 'network-only',
    skip: !canView,
  })

  const [approveStepMutation] = useMutation(APPROVE_STEP)
  const [rejectStepMutation] = useMutation(REJECT_STEP)

  const [getMutasi, { data: mutasiData, loading: loadingMutasi }] = useLazyQuery(GET_MUTASI_DETAILS, { fetchPolicy: 'network-only' })
  const [getDisposal, { data: disposalData, loading: loadingDisposal }] = useLazyQuery(GET_DISPOSAL_DETAILS, { fetchPolicy: 'network-only' })
  const [getLoss, { data: lossData, loading: loadingLoss }] = useLazyQuery(GET_LOSS_DETAILS, { fetchPolicy: 'network-only' })
  const [getLoan, { data: loanData, loading: loadingLoan }] = useLazyQuery(GET_LOAN_DETAILS, { fetchPolicy: 'network-only' })

  const [selectedApproval, setSelectedApproval] = useState<any | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')

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

  const handleCloseAction = () => {
    setSelectedApproval(null)
    setActionType(null)
  }

  return {
    pendingList: data?.myPendingApprovals || [],
    loading,
    selectedApproval,
    actionType,
    notes,
    setNotes,
    mutasiData: mutasiData?.mutasi,
    loadingMutasi,
    disposalData: disposalData?.disposal,
    loadingDisposal,
    lossData: lossData?.lossReport,
    loadingLoss,
    loanData: loanData?.peminjaman,
    loadingLoan,
    handleActionClick,
    handleConfirm,
    handleCloseAction,
  }
}
