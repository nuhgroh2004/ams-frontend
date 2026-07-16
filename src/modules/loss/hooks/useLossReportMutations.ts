import { useMutation } from '@apollo/client'
import { AJUKAN_KEHILANGAN, PROSES_TGR, SELESAIKAN_KEHILANGAN } from '../services'
import { toast } from '@/lib/toast'

export function useLossReportMutations(onSuccess?: () => void) {
  const [ajukanKehilanganMutation, { loading: isSubmitting }] = useMutation(AJUKAN_KEHILANGAN)
  const [prosesTGRMutation, { loading: isProcessingTGR }] = useMutation(PROSES_TGR)
  const [selesaikanKehilanganMutation, { loading: isCompleting }] = useMutation(SELESAIKAN_KEHILANGAN)

  const ajukanKehilangan = async (assetId: string, kronologi: string, file: File | null) => {
    if (!assetId || !kronologi) {
      toast.error('Aset dan Kronologi wajib diisi')
      return false
    }

    try {
      await ajukanKehilanganMutation({
        variables: {
          input: {
            asset_id: assetId,
            kronologi,
          },
          dokumen: file,
        },
      })
      toast.success('Laporan kehilangan berhasil dibuat dan workflow persetujuan dimulai')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal melaporkan kehilangan', err.message)
      return false
    }
  }

  const prosesTGR = async (id: string, nilaiGantiRugi: string) => {
    if (!id || !nilaiGantiRugi) return false

    try {
      await prosesTGRMutation({
        variables: {
          id,
          nilai_ganti_rugi: parseFloat(nilaiGantiRugi) || 0,
        },
      })
      toast.success('TGR berhasil diproses')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal memproses TGR', err.message)
      return false
    }
  }

  const selesaikanKehilangan = async (id: string) => {
    try {
      await selesaikanKehilanganMutation({ variables: { id } })
      toast.success('Laporan ganti rugi diselesaikan')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal menyelesaikan kasus', err.message)
      return false
    }
  }

  return {
    ajukanKehilangan,
    prosesTGR,
    selesaikanKehilangan,
    loading: isSubmitting || isProcessingTGR || isCompleting,
  }
}
