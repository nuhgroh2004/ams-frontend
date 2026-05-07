import { useQuery } from '@apollo/client'
import { GET_UNIT_KERJAS_QUERY, GET_UNIT_KERJAS_SIMPLE_QUERY } from '../services/unit-kerja.graphql'
import { UnitKerjaListResponse, UnitKerja } from '../types'

interface UseUnitKerjaListProps {
  page?: number
  limit?: number
  search?: string
}

/**
 * Hook for fetching paginated list of Unit Kerja
 */
export function useUnitKerjaList({
  page = 1,
  limit = 10,
  search = '',
}: UseUnitKerjaListProps = {}) {
  const { data, loading, error, refetch } = useQuery<{
    unitKerjas: UnitKerjaListResponse
  }>(GET_UNIT_KERJAS_QUERY, {
    variables: { page, limit, search },
    fetchPolicy: 'cache-and-network',
    skip: false,
  })

  return {
    unitKerjas: data?.unitKerjas.data || [],
    pagination: {
      total: data?.unitKerjas.total || 0,
      page: data?.unitKerjas.page || page,
      limit: data?.unitKerjas.limit || limit,
      totalPages: data?.unitKerjas.totalPages || 0,
    },
    loading,
    error,
    refetch,
  }
}

/**
 * Hook for fetching all Unit Kerja for dropdown/select options
 * No pagination, used for parent selection
 */
export function useUnitKerjaOptions() {
  const { data, loading, error } = useQuery<{
    unitKerjas: { data: Pick<UnitKerja, 'kode' | 'name' | 'singkatan'>[] }
  }>(GET_UNIT_KERJAS_SIMPLE_QUERY, {
    fetchPolicy: 'cache-and-network',
  })

  const options =
    data?.unitKerjas.data
      .filter((unit) => typeof unit.kode === 'string' && unit.kode.length > 0)
      .map((unit) => ({
        value: unit.kode,
        label: `${unit.name}${unit.singkatan ? ` (${unit.singkatan})` : ''}`,
      })) || []

  return {
    options,
    loading,
    error,
  }
}
