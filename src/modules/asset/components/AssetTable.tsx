'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from 'lucide-react'
import { 
  AppCard, 
  AppBadge, 
  AppButton,
} from '@/components/primitives'
import { Asset } from '../types'

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface AssetTableProps {
  assets: Asset[]
  loading?: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onDelete?: (id: string) => void
  onEdit?: (asset: Asset) => void
}

export function AssetTable({
  assets,
  loading,
  pagination,
  onPageChange,
  onDelete,
  onEdit
}: AssetTableProps) {
  if (loading && assets.length === 0) {
    return (
      <AppCard className="p-12 flex flex-col items-center justify-center gap-4 border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Memuat data aset...</p>
      </AppCard>
    )
  }

  // Helper to format currency
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

  const hasActions = !!onEdit || !!onDelete

  return (
    <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
      <AppCard className="overflow-hidden mt-5 border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nama & Kode Barang
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Detail Perolehan
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Unit & Lokasi
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Kondisi
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                {hasActions && (
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={hasActions ? 6 : 5} className="px-6 py-12 text-center text-muted-foreground">
                    Tidak ada data aset ditemukan.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {asset.nama_barang}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {asset.kode_barang || '-'} {asset.nomor_register ? `(${asset.nomor_register})` : ''}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {formatRupiah(asset.nilai_perolehan)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Tahun {asset.tahun_perolehan || '-'} | {asset.sumber_dana || 'Sumber Dana -'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {asset.unit?.nama_unit || '-'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {asset.lokasi
                            ? [asset.lokasi.nama_gedung, asset.lokasi.lantai, asset.lokasi.ruangan]
                                .filter(Boolean)
                                .join(' - ')
                            : '-'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <AppBadge 
                        variant={
                          asset.kondisi === 'baik' 
                            ? 'success' 
                            : asset.kondisi === 'rusak_ringan' 
                            ? 'warning' 
                            : 'danger'
                        } 
                        badgeStyle="outline"
                      >
                        {asset.kondisi === 'baik' 
                          ? 'Baik' 
                          : asset.kondisi === 'rusak_ringan' 
                          ? 'Rusak Ringan' 
                          : asset.kondisi === 'rusak_berat'
                          ? 'Rusak Berat'
                          : '-'}
                      </AppBadge>
                    </td>

                    <td className="px-6 py-4">
                      <AppBadge 
                        variant={
                          asset.status_penggunaan === 'aktif' 
                            ? 'success' 
                            : asset.status_penggunaan === 'dipinjam' 
                            ? 'info' 
                            : asset.status_penggunaan === 'maintenance'
                            ? 'warning'
                            : 'danger'
                        } 
                        badgeStyle="dot"
                      >
                        {asset.status_penggunaan === 'aktif' 
                          ? 'Aktif' 
                          : asset.status_penggunaan === 'dipinjam' 
                          ? 'Dipinjam'
                          : asset.status_penggunaan === 'maintenance'
                          ? 'Perawatan'
                          : asset.status_penggunaan === 'dihapus'
                          ? 'Dihapus'
                          : asset.status_penggunaan === 'hilang'
                          ? 'Hilang'
                          : '-'}
                      </AppBadge>
                    </td>

                    {hasActions && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <AppButton 
                              size="icon_sm" 
                              variant="ghost" 
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => onEdit(asset)}
                            >
                              <Pencil className="h-4 w-4" />
                            </AppButton>
                          )}
                          {onDelete && (
                            <AppButton 
                              size="icon_sm" 
                              variant="ghost" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => onDelete(asset.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </AppButton>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AppCard>

      {/* Pagination Container */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 mt-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-medium text-foreground">
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> dari <span className="font-medium text-foreground">{pagination.total}</span> aset
          </p>
          <div className="flex items-center gap-2">
            <AppButton 
              variant="outline" 
              size="sm" 
              className="gap-1"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </AppButton>
            <AppButton 
              variant="outline" 
              size="sm" 
              className="gap-1"
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
