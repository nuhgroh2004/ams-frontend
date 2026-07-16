import { useMutation } from '@apollo/client'
import { CREATE_INVENTORY_SCHEDULE, UPDATE_INVENTORY_DETAIL, COMPLETE_INVENTORY } from '../services'
import { toast } from '@/lib/toast'

export function useInventoryMutations(onSuccess?: () => void, onDetailSuccess?: () => void) {
  const [createInventoryMutation, { loading: isCreating }] = useMutation(CREATE_INVENTORY_SCHEDULE)
  const [updateDetailMutation, { loading: isUpdating }] = useMutation(UPDATE_INVENTORY_DETAIL)
  const [completeInventoryMutation, { loading: isCompleting }] = useMutation(COMPLETE_INVENTORY)

  const createInventorySchedule = async (unitId: string, startDate: string, endDate: string, picId: string) => {
    if (!unitId || !startDate || !endDate || !picId) {
      toast.error('Semua kolom wajib diisi')
      return false
    }

    try {
      await createInventoryMutation({
        variables: {
          input: {
            unit_id: unitId,
            tanggal_mulai: startDate,
            tanggal_selesai: endDate,
            pic_id: picId,
          },
        },
      })
      toast.success('Jadwal stock opname berhasil dibuat')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal membuat jadwal', err.message)
      return false
    }
  }

  const updateInventoryDetail = async (inventoryId: string, assetId: string, statusFisik: string) => {
    if (!inventoryId || !assetId) return false
    try {
      await updateDetailMutation({
        variables: {
          inventory_id: inventoryId,
          asset_id: assetId,
          status_physic: statusFisik, // Note: GQL schema is status_fisik in resolvers, verify backend resolvers if fails
          status_fisik: statusFisik,
          keterangan: 'Pencocokan fisik',
        },
      })
      toast.success('Fisik aset terverifikasi')
      if (onDetailSuccess) onDetailSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal memperbarui status', err.message)
      return false
    }
  }

  const completeInventory = async (inventoryId: string, file: File | null) => {
    if (!inventoryId || !file) {
      toast.error('Dokumen BAST wajib dipilih')
      return false
    }

    try {
      await completeInventoryMutation({
        variables: {
          id: inventoryId,
          beritaAcara: file,
        },
      })
      toast.success('Opname berhasil diselesaikan dan status aset terupdate')
      if (onSuccess) onSuccess()
      return true
    } catch (err: any) {
      toast.error('Gagal menyelesaikan stock opname', err.message)
      return false
    }
  }

  return {
    createInventorySchedule,
    updateInventoryDetail,
    completeInventory,
    loading: isCreating || isUpdating || isCompleting,
  }
}
