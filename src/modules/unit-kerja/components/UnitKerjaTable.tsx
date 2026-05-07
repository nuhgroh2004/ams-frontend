'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { UnitKerja } from '../types'
import { DataTable } from '@/components/patterns/tables/DataTable'
import {
  AppBadge,
  AppButton,
  AppDropdown,
  AppDropdownContent,
  AppDropdownItem,
  AppDropdownTrigger,
} from '@/components/primitives'
import { Pencil, Trash2, MoreVertical, Building2 } from 'lucide-react'

interface UnitKerjaTableProps {
  data: UnitKerja[]
  loading?: boolean
  pageCount?: number
  onPageChange?: (page: number) => void
  onEdit?: (unit: UnitKerja) => void
  onDelete?: (unit: UnitKerja) => void
}

/**
 * DataTable component for Unit Kerja list
 * Displays unit information with hierarchy and type badges
 */
export function UnitKerjaTable({
  data,
  loading,
  pageCount,
  onPageChange,
  onEdit,
  onDelete,
}: UnitKerjaTableProps) {
  const columns: ColumnDef<UnitKerja>[] = [
    {
      accessorKey: 'name',
      header: 'Unit Kerja',
      cell: ({ row }) => {
        const unit = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground">{unit.name}</span>
              <span className="text-xs text-muted-foreground">{unit.kode}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'singkatan',
      header: 'Singkatan',
    },
    {
      accessorKey: 'hirarki',
      header: 'Hirarki',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.original.hirarki}</span>
          <span className="text-xs text-muted-foreground">{row.original.hirarki_abbr}</span>
        </div>
      ),
    },
    {
      header: 'Tipe',
      cell: ({ row }) => {
        const unit = row.original
        return (
          <div className="flex flex-wrap gap-1">
            {unit.is_unor && <AppBadge variant="info">Unor</AppBadge>}
            {unit.is_satker && <AppBadge variant="success">Satker</AppBadge>}
            {unit.is_subsatker && <AppBadge variant="warning">SubSatker</AppBadge>}
            {unit.is_sekretariat && (
              <AppBadge variant="neutral">
                Sekretariat
              </AppBadge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'jabatan_name',
      header: 'Jabatan Pemimpin',
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const unit = row.original
        return (
          <div className="flex justify-end">
            <AppDropdown>
              <AppDropdownTrigger asChild>
                <AppButton variant="ghost" size="icon_sm">
                  <MoreVertical className="h-4 w-4" />
                </AppButton>
              </AppDropdownTrigger>
              <AppDropdownContent align="end" className="w-40">
                <AppDropdownItem onClick={() => onEdit?.(unit)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </AppDropdownItem>
                <AppDropdownItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(unit)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </AppDropdownItem>
              </AppDropdownContent>
            </AppDropdown>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={loading}
      manualPagination
      pageCount={pageCount}
      onPaginationChange={(state) => onPageChange?.(state.pageIndex + 1)}
    />
  )
}
