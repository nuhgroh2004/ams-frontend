'use client'

import React from 'react'
import { 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Calendar,
  Layers,
  FileText
} from 'lucide-react'
import { 
  AppCard, 
  AppButton,
} from '@/components/primitives'
import { Procurement } from '../types'

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ProcurementTableProps {
  procurements: Procurement[]
  loading?: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onDelete?: (id: string) => void
  onViewDetails?: (procurement: Procurement) => void
}

export function ProcurementTable({
  procurements,
  loading,
  pagination,
  onPageChange,
  onDelete,
  onViewDetails
}: ProcurementTableProps) {
  if (loading && procurements.length === 0) {
    return (
      <AppCard className="p-12 flex flex-col items-center justify-center gap-4 border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Memuat data pengadaan...</p>
      </AppCard>
    )
  }

  const formatRupiah = (value?: string | null) => {
    if (!value) return '-'
    const num = parseFloat(value)
    if (isNaN(num)) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
      <AppCard className="overflow-hidden mt-5 border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nomor Pengadaan / Kontrak
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tanggal Pengadaan
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rincian Barang
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Nilai
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {procurements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Tidak ada data transaksi pengadaan ditemukan.
                  </td>
                </tr>
              ) : (
                procurements.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {p.nomor_pengadaan}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          Kontrak: {p.nomor_kontrak || '-'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground font-medium">
                        {p.vendor || '-'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-foreground">{p.tanggal_pengadaan || '-'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Layers className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-foreground">
                          {p.items?.length || 0} Item
                        </span>
                        <span className="text-xs">
                          ({p.items?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0} unit)
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      {formatRupiah(p.total_nilai)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <AppButton 
                          size="sm" 
                          variant="outline" 
                          icon={FileText}
                          onClick={() => onViewDetails?.(p)}
                        >
                          Detail
                        </AppButton>
                        <AppButton 
                          size="icon_sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete?.(p.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AppCard>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-medium text-foreground">
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> dari <span className="font-medium text-foreground">{pagination.total}</span> pengadaan
          </p>
          <div className="flex items-center gap-2">
            <AppButton 
              variant="outline" 
              size="sm" 
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </AppButton>
            <AppButton 
              variant="outline" 
              size="sm" 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </AppButton>
          </div>
        </div>
      )}
    </div>
  )
}
