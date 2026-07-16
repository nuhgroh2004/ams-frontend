import { useQuery } from '@apollo/client'
import { GET_LOSS_REPORTS, GET_ASSETS_SIMPLE } from '../services'
import { LossReportsPaginated, AssetSimple } from '../types'

interface UseLossReportsProps {
  statusFilter: string
  page: number
  limit: number
}

export function useLossReports({ statusFilter, page, limit }: UseLossReportsProps) {
  const variables: any = { page, limit }
  if (statusFilter !== 'all') variables.status = statusFilter

  const { data, loading, refetch } = useQuery<{ lossReports: LossReportsPaginated }>(GET_LOSS_REPORTS, {
    variables,
    fetchPolicy: 'network-only',
  })

  const { data: assetData, loading: loadingAssets } = useQuery<{ assets: { data: AssetSimple[] } }>(GET_ASSETS_SIMPLE)

  return {
    lossList: data?.lossReports?.data || [],
    totalPages: data?.lossReports?.totalPages || 0,
    assets: assetData?.assets?.data || [],
    loading: loading || loadingAssets,
    refetch,
  }
}
