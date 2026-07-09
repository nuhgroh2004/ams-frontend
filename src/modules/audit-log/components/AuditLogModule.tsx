'use client'

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppInput } from '@/components/primitives'
import { gql, useQuery } from '@apollo/client'
import dayjs from 'dayjs'

const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($filter: AuditLogFilterInput, $page: Int, $limit: Int) {
    auditLogs(filter: $filter, page: $page, limit: $limit) {
      total
      page
      limit
      totalPages
      data {
        id
        waktu
        aktivitas
        tabel_terkait
        data_id
        ip_address
        user {
          id
          nama_lengkap
        }
      }
    }
  }
`

export function AuditLogModule() {
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

  const auditData = data?.auditLogs?.data || []
  const total = data?.auditLogs?.total || 0
  const totalPages = data?.auditLogs?.totalPages || 0

  const columns = [
    {
      accessorKey: 'waktu',
      header: 'Waktu',
      cell: ({ row }: any) => dayjs(row.original.waktu).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      accessorKey: 'user',
      header: 'Pengguna',
      cell: ({ row }: any) => row.original.user?.nama_lengkap || 'Sistem',
    },
    {
      accessorKey: 'aktivitas',
      header: 'Aktivitas',
    },
    {
      accessorKey: 'tabel_terkait',
      header: 'Tabel Terkait',
      cell: ({ row }: any) => row.original.tabel_terkait || '-',
    },
    {
      accessorKey: 'data_id',
      header: 'ID Data',
      cell: ({ row }: any) => row.original.data_id || '-',
    },
    {
      accessorKey: 'ip_address',
      header: 'IP Address',
      cell: ({ row }: any) => row.original.ip_address || '-',
    },
  ]

  return (
    <PageShell 
      title="Audit Log" 
      description="Pantau setiap aktivitas dan perubahan data di dalam sistem."
    >
      <div className="space-y-6">
        <div className="bg-card p-4 rounded-2xl border border-border">
          <AppInput 
            placeholder="Cari aktivitas..."
            icon={Search}
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DataTable 
          columns={columns} 
          data={auditData} 
          isLoading={loading}
          manualPagination
          pageCount={totalPages}
          pageIndex={page - 1}
          onPaginationChange={(state) => setPage(state.pageIndex + 1)}
        />
      </div>
    </PageShell>
  )
}
