import React from 'react'
import { AppButton } from '@/components/primitives'
import { Eye } from 'lucide-react'
import { DisposalDTO } from '../types'

export const getDisposalColumns = (onDetail: (disposal: DisposalDTO) => void) => [
  {
    accessorKey: 'asset.nama_barang',
    header: 'Nama Aset',
    cell: ({ row }: any) => (
      <div>
        <p className="font-semibold text-sm">{row.original.asset.nama_barang}</p>
        <p className="text-xs text-muted-foreground">{row.original.asset.nomor_register || '-'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'alasan_penghapusan',
    header: 'Alasan',
    cell: ({ row }: any) => <span className="truncate block max-w-xs">{row.original.alasan_penghapusan}</span>,
  },
  {
    accessorKey: 'nilai_penjualan',
    header: 'Nilai Penjualan',
    cell: ({ row }: any) => row.original.nilai_penjualan ? `Rp ${parseFloat(row.original.nilai_penjualan).toLocaleString()}` : '-',
  },
  {
    accessorKey: 'workflowInstance.status',
    header: 'Status Approval',
    cell: ({ row }: any) => {
      const statusMap: Record<string, { label: string; class: string }> = {
        dalam_proses: { label: 'Dalam Proses', class: 'bg-blue-500/10 text-blue-500' },
        disetujui: { label: 'Disetujui', class: 'bg-green-500/10 text-green-500' },
        ditolak: { label: 'Ditolak', class: 'bg-red-500/10 text-red-500' },
      }
      const state = statusMap[row.original.workflowInstance?.status] || { label: 'Draft', class: 'bg-muted text-muted-foreground' }
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${state.class}`}>
          {state.label}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Detail',
    cell: ({ row }: any) => (
      <AppButton size="sm" variant="outline" icon={Eye} onClick={() => onDetail(row.original)}>
        Detail
      </AppButton>
    ),
  },
]
