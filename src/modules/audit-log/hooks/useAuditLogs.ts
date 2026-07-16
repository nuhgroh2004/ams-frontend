import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { GET_AUDIT_LOGS } from '../services'

export function useAuditLogs() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const filter = debouncedSearch ? { aktivitas: debouncedSearch } : {}

  const { data, loading } = useQuery(GET_AUDIT_LOGS, {
    variables: { filter, page, limit },
    fetchPolicy: 'network-only',
  })

  return {
    search,
    setSearch,
    page,
    setPage,
    limit,
    auditData: data?.auditLogs?.data || [],
    totalPages: data?.auditLogs?.totalPages || 0,
    loading,
  }
}
