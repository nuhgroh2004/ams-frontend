import { useMutation } from '@apollo/client'
import { DELETE_UNIT_KERJA_MUTATION, GET_UNIT_KERJAS_QUERY } from '../services/unit-kerja.graphql'
import { toast } from '@/lib/toast'

/**
 * Hook for deleting Unit Kerja by kode
 */
export function useDeleteUnitKerja() {
  const [deleteUnitKerja, { loading }] = useMutation(DELETE_UNIT_KERJA_MUTATION, {
    refetchQueries: [{ query: GET_UNIT_KERJAS_QUERY }],
    awaitRefetchQueries: false,
    onCompleted: () => {
      toast.success(
        'Unit Kerja Berhasil Dihapus',
        'Unit kerja telah dihapus dari sistem.'
      )
    },
    onError: (error) => {
      toast.graphqlError(error, 'Gagal menghapus unit kerja')
    },
  })

  const handleDelete = async (kode: string) => {
    try {
      const result = await deleteUnitKerja({
        variables: { kode },
      })
      return result.data
    } catch (error) {
      throw error
    }
  }

  return {
    deleteUnitKerja: handleDelete,
    loading,
  }
}
