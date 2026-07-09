'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { AppButton } from '@/components/primitives'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * DataTable Pattern Component
 * TanStack Table wrapper using primitives for styling
 */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  onPaginationChange?: (state: PaginationState) => void
  enableColumnVisibility?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  manualPagination?: boolean
}

function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPaginationChange,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  })

  React.useEffect(() => {
    setPagination({ pageIndex, pageSize })
  }, [pageIndex, pageSize])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      pagination: pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(newState)
      onPaginationChange?.(newState)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    manualPagination: manualPagination,
    pageCount: pageCount,
  })

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border overflow-x-auto bg-card">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-sm text-foreground"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-xs text-muted-foreground">
            Page <span className="text-foreground font-medium">{table.getState().pagination.pageIndex + 1}</span> of{' '}
            <span className="text-foreground font-medium">{table.getPageCount()}</span>
          </div>
          <div className="flex gap-2">
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
              icon={ChevronLeft}
            >
              Previous
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
              icon={ChevronRight}
              iconPosition="right"
            >
              Next
            </AppButton>
          </div>
        </div>
      )}
    </div>
  )
}

export { DataTable }
export type { DataTableProps }
