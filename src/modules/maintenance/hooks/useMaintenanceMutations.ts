import { useMutation } from '@apollo/client'
import { CREATE_MAINTENANCE, START_MAINTENANCE, FINISH_MAINTENANCE } from '../services'
import { toast } from '@/lib/toast'
import dayjs from 'dayjs'

export function useMaintenanceMutations(onSuccess?: () => void) {
  const [createMaintenanceMutation, { loading: isCreating }] = useMutation(CREATE_MAINTENANCE)
  const [startMaintenanceMutation, { loading: isStarting }] = useMutation(START_MAINTENANCE)
  const [finishMaintenanceMutation, { loading: isFinishing }] = useMutation(FINISH_MAINTENANCE)

  const createMaintenance = async (assetId: string, jenisPerawatan: string, estimasiBiaya: string, deskripsi: string) => {
    if (!assetId || !jenisPerawatan) {
      toast.error('Aset dan Jenis Perawatan wajib diisi')
      return false
    }

    try {
      await createMaintenanceMutation({
        variables: {
          input: {
            asset_id: assetId,
            jenis_perawatan: jenisPerawatan,
            deskripsi,
            estimasi_biaya: parseFloat(estimasiBiaya) || 0,
            tanggal_mulai: dayjs().format('YYYY-MM-DD'),
          },
        },
      })
      toast.success('Pengajuan perawatan berhasil dibuat')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal mengajukan perawatan', err.message)
      return false
    }
  }

  const startMaintenance = async (id: string) => {
    try {
      await startMaintenanceMutation({ variables: { id } })
      toast.success('Proses perbaikan dimulai')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal memulai perbaikan', err.message)
      return false
    }
  }

  const finishMaintenance = async (id: string, biayaReal: string, kondisiSetelah: string) => {
    if (!id || !biayaReal) {
      toast.error('Biaya riil wajib diisi')
      return false
    }

    try {
      await finishMaintenanceMutation({
        variables: {
          id,
          biaya_real: parseFloat(biayaReal) || 0,
          kondisi_setelah: kondisiSetelah,
          tanggal_selesai: dayjs().format('YYYY-MM-DD'),
        },
      })
      toast.success('Perawatan diselesaikan, status aset kembali aktif')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal menyelesaikan perawatan', err.message)
      return false
    }
  }

  return {
    createMaintenance,
    startMaintenance,
    finishMaintenance,
    loading: isCreating || isStarting || isFinishing,
  }
}
