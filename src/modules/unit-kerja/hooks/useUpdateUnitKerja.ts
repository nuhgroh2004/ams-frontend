import { useMutation } from '@apollo/client'
import { UPDATE_UNIT_KERJA_MUTATION, GET_UNIT_KERJAS_QUERY } from '../services/unit-kerja.graphql'
import { UnitKerjaFormValues } from '../schemas/unit-kerja.schema'
import { unitKerjaMapper } from '../mappers/unit-kerja.mapper'
import { toast } from '@/lib/toast'

/**
 * Hook for updating existing Unit Kerja
 * Requires kode (primary identifier) from the response
 */
export function useUpdateUnitKerja() {
  const [updateUnitKerja, { loading }] = useMutation(UPDATE_UNIT_KERJA_MUTATION, {
    refetchQueries: [{ query: GET_UNIT_KERJAS_QUERY }],
    awaitRefetchQueries: false,
    onCompleted: (data) => {
      toast.success(
        'Unit Kerja Berhasil Diperbarui',
        `Unit kerja "${data.updateUnitKerja.name}" telah disimpan.`
      )
    },
    onError: (error) => {
      toast.graphqlError(error, 'Gagal memperbarui unit kerja')
    },
  })

  const handleUpdate = async (kode: string, values: UnitKerjaFormValues) => {
    const input = unitKerjaMapper.toUpdateInput(values)
    try {
      const result = await updateUnitKerja({
        variables: { kode, input },
      })
      return result.data
    } catch (error) {
      throw error
    }
  }

  return {
    updateUnitKerja: handleUpdate,
    loading,
  }
}
