import { useMutation } from '@apollo/client'
import { AJUKAN_DISPOSAL } from '../services'
import { toast } from '@/lib/toast'

export function useDisposalMutations(onSuccess?: () => void) {
  const [ajukanDisposalMutation, { loading: isSubmitting }] = useMutation(AJUKAN_DISPOSAL)

  const ajukanDisposal = async (assetId: string, alasan: string, nilaiPenjualan: string, file: File | null) => {
    try {
      await ajukanDisposalMutation({
        variables: {
          input: {
            asset_id: assetId,
            alasan_penghapusan: alasan,
            nilai_penjualan: nilaiPenjualan ? parseFloat(nilaiPenjualan) : undefined,
          },
          dokumen: file,
        },
      })
      toast.success('Pengajuan penghapusan berhasil diajukan untuk proses persetujuan')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal mengajukan penghapusan', err.message)
      return false
    }
  }

  return {
    ajukanDisposal,
    isSubmitting,
  }
}
