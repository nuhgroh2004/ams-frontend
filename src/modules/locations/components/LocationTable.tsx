import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { AppButton } from '@/components/primitives/AppButton';
import { AppInput } from '@/components/primitives/AppInput';
import { Location } from '../types';

interface LocationTableProps {
  data: Location[];
  loading?: boolean;
  onEdit?: (location: Location) => void;
  onDelete?: (id: string) => void;
}

export const LocationTable = ({ data, loading, onEdit, onDelete }: LocationTableProps) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Location>[] = [
    {
      accessorKey: 'nama_gedung',
      header: 'Nama Gedung',
      cell: ({ getValue }) => getValue() || '-',
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
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      accessorKey: 'unit.name',
      header: 'Unit Kerja',
      cell: ({ getValue }) => getValue() || '-',
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {onEdit && (
            <AppButton
              size="sm"
              variant="outline"
              onClick={() => onEdit(row.original)}
            >
              Edit
            </AppButton>
          )}
          {onDelete && (
            <AppButton
              size="sm"
              variant="danger"
              onClick={() => onDelete(row.original.id)}
            >
              Delete
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
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <AppInput
          placeholder="Search locations..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-200 px-4 py-2 text-left font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border border-gray-200 px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </AppButton>
          <AppButton
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </AppButton>
        </div>
        <span className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
};