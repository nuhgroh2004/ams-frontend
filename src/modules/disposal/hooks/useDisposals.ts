import { useQuery } from '@apollo/client'
import { GET_DISPOSALS, GET_ASSETS_SIMPLE } from '../services'
import { DisposalPaginated, AssetSimple } from '../types'

interface UseDisposalsProps {
  statusFilter: string
  page: number
  limit: number
}

export function useDisposals({ statusFilter, page, limit }: UseDisposalsProps) {
  const { data, loading, error, refetch } = useQuery<{ disposals: DisposalPaginated }>(GET_DISPOSALS, {
    variables: {
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit,
    },
    fetchPolicy: 'network-only',
  })

  const { data: assetsData, loading: loadingAssets } = useQuery<{ assets: { data: AssetSimple[] } }>(GET_ASSETS_SIMPLE)

  return {
    disposalsList: data?.disposals?.data || [],
    totalPages: data?.disposals?.totalPages || 1,
    assets: assetsData?.assets?.data || [],
    loading: loading || loadingAssets,
    error,
    refetch,
  }
}
