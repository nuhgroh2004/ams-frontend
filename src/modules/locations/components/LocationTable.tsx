import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Search, Plus } from 'lucide-react';
import { AppCard, AppButton, AppInput } from '@/components/primitives';
import { Location } from '../types';

interface LocationTableProps {
  data: Location[];
  loading?: boolean;
  onEdit?: (location: Location) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export const LocationTable = ({ data, loading, onEdit, onDelete, onAdd }: LocationTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Location, any>[] = [
    {
      accessorKey: 'nama_gedung',
      header: 'Nama Gedung',
      cell: ({ getValue }) => <span className="font-bold text-foreground">{getValue() || '-'}</span>,
    },
    {
      accessorKey: 'lantai',
      header: 'Lantai',
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      accessorKey: 'ruangan',
      header: 'Ruangan',
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      accessorKey: 'kode_lokasi',
      header: 'Kode Lokasi',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
          {getValue() || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'unit.nama_unit',
      header: 'Unit Kerja',
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {onEdit && (
            <AppButton
              size="icon_sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </AppButton>
          )}
          {onDelete && (
            <AppButton
              size="icon_sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </AppButton>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading && data.length === 0) {
    return (
      <AppCard className="p-12 flex flex-col items-center justify-center gap-4 border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Memuat data lokasi...</p>
      </AppCard>
    );
  }

  return (
    <div className={loading ? 'opacity-50 pointer-events-none transition-opacity space-y-4' : 'transition-opacity space-y-4'}>
      {/* Notion-style Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
          <AppInput
            placeholder="Cari lokasi berdasarkan ruangan, kode, gedung..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 w-full bg-input border-border focus:border-primary focus:ring-primary h-9 rounded-lg text-sm"
          />
        </div>
        {onAdd && (
          <AppButton onClick={onAdd} variant="primary" icon={Plus}>
            Tambah Lokasi
          </AppButton>
        )}
      </div>

      <AppCard className="overflow-hidden mt-5 border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {table.getAllLeafColumns().map((column) => {
                    const header = headerGroup.headers.find(h => h.column.id === column.id);
                    if (!header) return null;
                    return (
                      <th
                        key={column.id}
                        className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12 text-sm text-muted-foreground">
                    Tidak ada data lokasi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card">
          <div className="text-xs text-muted-foreground">
            Menampilkan halaman{' '}
            <span className="font-semibold text-foreground">
              {table.getState().pagination.pageIndex + 1}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-foreground">
              {table.getPageCount()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AppButton
              variant="outline"
              size="icon_sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </AppButton>
            <AppButton
              variant="outline"
              size="icon_sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </AppButton>
          </div>
        </div>
      </AppCard>
    </div>
  );
};