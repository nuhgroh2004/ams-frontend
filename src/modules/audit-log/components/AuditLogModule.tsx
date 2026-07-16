'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { PageShell, DataTable } from '@/components/patterns'
import { AppInput } from '@/components/primitives'
import { useAuditLogs } from '../hooks/useAuditLogs'
import { getAuditColumns } from './AuditColumns'

export function AuditLogModule() {
  const {
    search,
    setSearch,
    page,
    setPage,
    auditData,
    totalPages,
    loading,
  } = useAuditLogs()

  const columns = getAuditColumns()

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
export default AuditLogModule
