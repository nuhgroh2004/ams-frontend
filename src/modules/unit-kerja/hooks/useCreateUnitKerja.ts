import { useMutation } from '@apollo/client'
import { CREATE_UNIT_KERJA_MUTATION, GET_UNIT_KERJAS_QUERY } from '../services/unit-kerja.graphql'
import { UnitKerjaFormValues } from '../schemas/unit-kerja.schema'
import { unitKerjaMapper } from '../mappers/unit-kerja.mapper'
import { toast } from '@/lib/toast'

/**
 * Hook for creating new Unit Kerja
 * Handles mutation, refetch, and notifications
 */
export function useCreateUnitKerja() {
  const [createUnitKerja, { loading }] = useMutation(CREATE_UNIT_KERJA_MUTATION, {
    refetchQueries: [{ query: GET_UNIT_KERJAS_QUERY }],
    awaitRefetchQueries: false,
    onCompleted: (data) => {
      toast.success(
        'Unit Kerja Berhasil Dibuat',
        `Unit kerja "${data.createUnitKerja.name}" telah disimpan ke sistem.`
      )
    },
    onError: (error) => {
      toast.graphqlError(error, 'Gagal membuat unit kerja')
    },
  })

  const handleCreate = async (values: UnitKerjaFormValues) => {
    const input = unitKerjaMapper.toCreateInput(values)
    try {
      const result = await createUnitKerja({
        variables: { input },
      })
      return result.data
    } catch (error) {
      throw error
    }
  }

  return {
    createUnitKerja: handleCreate,
    loading,
  }
}
