import { useQuery } from '@apollo/client'
import { GET_INVENTORIES, GET_UNITS_AND_USERS, GET_INVENTORY_DETAILS } from '../services'
import { InventoriesPaginated, UnitSimple, UserSimple, InventoryFullDTO } from '../types'

interface UseInventoryProps {
  statusFilter: string
  page: number
  limit: number
  selectedInventoryId: string | null
}

export function useInventory({ statusFilter, page, limit, selectedInventoryId }: UseInventoryProps) {
  const queryVariables: any = { page, limit }
  if (statusFilter !== 'all') {
    queryVariables.status = statusFilter
  }

  const { data, loading, refetch } = useQuery<{ inventories: InventoriesPaginated }>(GET_INVENTORIES, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  })

  const { data: selectData, loading: loadingMetadata } = useQuery<{ units: UnitSimple[]; users: { data: UserSimple[] } }>(
    GET_UNITS_AND_USERS
  )

  const { data: detailData, refetch: refetchDetails, loading: loadingDetails } = useQuery<{ inventory: InventoryFullDTO }>(
    GET_INVENTORY_DETAILS,
    {
      variables: { id: selectedInventoryId || '' },
      skip: !selectedInventoryId,
      fetchPolicy: 'network-only',
    }
  )

  return {
    inventoriesList: data?.inventories?.data || [],
    totalPages: data?.inventories?.totalPages || 0,
    units: selectData?.units || [],
    usersList: selectData?.users?.data || [],
    detailData: detailData?.inventory || null,
    loading: loading || loadingMetadata,
    loadingDetails,
    refetch,
    refetchDetails,
  }
}
