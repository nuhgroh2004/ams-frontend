import { useQuery } from '@apollo/client'
import { GET_MAINTENANCE_RECORDS, GET_ASSETS_SIMPLE } from '../services'
import { MaintenanceRecordsPaginated, AssetSimple } from '../types'

interface UseMaintenanceProps {
  statusFilter: string
  page: number
  limit: number
}

export function useMaintenance({ statusFilter, page, limit }: UseMaintenanceProps) {
  const variables: any = { page, limit }
  if (statusFilter !== 'all') variables.status = statusFilter

  const { data, loading, refetch } = useQuery<{ maintenanceRecords: MaintenanceRecordsPaginated }>(
    GET_MAINTENANCE_RECORDS,
    { variables, fetchPolicy: 'network-only' }
  )

  const { data: assetData, loading: loadingAssets } = useQuery<{ assets: { data: AssetSimple[] } }>(GET_ASSETS_SIMPLE)

  return {
    records: data?.maintenanceRecords?.data || [],
    totalPages: data?.maintenanceRecords?.totalPages || 0,
    assets: assetData?.assets?.data || [],
    loading: loading || loadingAssets,
    refetch,
  }
}
