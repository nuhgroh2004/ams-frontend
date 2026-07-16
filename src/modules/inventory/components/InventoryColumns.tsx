import React from 'react'
import { AppButton } from '@/components/primitives'
import { ClipboardList } from 'lucide-react'

interface ColumnOptions {
  onOpenChecklist: (id: string) => void
}

export const getInventoryColumns = ({ onOpenChecklist }: ColumnOptions) => [
  {
    accessorKey: 'unit.nama_unit',
    header: 'Unit Kerja',
  },
  {
    accessorKey: 'tanggal_mulai',
    header: 'Tanggal Mulai',
  },
  {
    accessorKey: 'tanggal_selesai',
    header: 'Tanggal Selesai',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const colors: Record<string, string> = {
        proses: 'bg-blue-500/10 text-blue-500',
        selesai: 'bg-green-500/10 text-green-500',
      }
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${colors[row.original.status] || ''}`}>
          {row.original.status}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => (
      <AppButton size="sm" icon={ClipboardList} onClick={() => onOpenChecklist(row.original.id)}>
        {row.original.status === 'proses' ? 'Lakukan Checklist' : 'Lihat Detail'}
      </AppButton>
    ),
  },
]
