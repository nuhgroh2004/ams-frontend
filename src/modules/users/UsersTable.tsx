'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { 
  Pencil, 
  Power, 
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

interface User {
  id: string
  nama_lengkap: string
  email: string
  nrp: string
  jabatan: string
  is_active: boolean
  unit?: {
    nama_unit: string
  }
  roles?: {
    nama_role: string
  }[]
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface UsersTableProps {
  users: User[]
  loading?: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onDelete?: (id: string) => void
  onToggleStatus?: (id: string, currentStatus: boolean) => void
  onEdit?: (user: User) => void
}

export function UsersTable({
  users,
  loading,
  pagination,
  onPageChange,
  onDelete,
  onToggleStatus,
  onEdit
}: UsersTableProps) {
  if (loading && users.length === 0) {
    return (
      <AppCard className="p-12 flex flex-col items-center justify-center gap-4 border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Memuat data pengguna...</p>
      </AppCard>
    )
  }

  return (
    <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
      <AppCard className="overflow-hidden border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  NRP & Jabatan
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Unit Kerja
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {user.nama_lengkap}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {user.nrp}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.jabatan}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">
                        {user.unit?.nama_unit || '-'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <AppBadge variant="neutral" badgeStyle="outline">
                        {user.roles?.[0]?.nama_role || 'User'}
                      </AppBadge>
                    </td>

                    <td className="px-6 py-4">
                      <AppBadge 
                        variant={user.is_active ? 'success' : 'danger'} 
                        badgeStyle="dot"
                      >
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </AppBadge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <AppButton 
                          size="icon_sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => onEdit?.(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </AppButton>
                        <AppButton 
                          size="icon_sm" 
                          variant="ghost" 
                          className={cn(
                            "transition-colors",
                            user.is_active 
                              ? "text-success/70 hover:text-success" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => onToggleStatus?.(user.id, user.is_active)}
                        >
                          <Power className="h-4 w-4" />
                        </AppButton>
                        <AppButton 
                          size="icon_sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete?.(user.id)}
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

      {/* Pagination Container */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-medium text-foreground">
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> dari <span className="font-medium text-foreground">{pagination.total}</span> pengguna
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
