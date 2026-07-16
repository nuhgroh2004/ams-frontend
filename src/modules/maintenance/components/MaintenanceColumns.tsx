import React from 'react'
import { AppButton } from '@/components/primitives'
import { Play, Check } from 'lucide-react'
import { MaintenanceRecordDTO } from '../types'

interface ColumnOptions {
  canCreate: boolean
  canComplete: boolean
  onStart: (id: string) => void
  onFinishClick: (id: string) => void
}

export const getMaintenanceColumns = ({
  canCreate,
  canComplete,
  onStart,
  onFinishClick,
}: ColumnOptions) => [
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
    accessorKey: 'jenis_perawatan',
    header: 'Jenis Perawatan',
  },
  {
    accessorKey: 'tanggal_mulai',
    header: 'Tanggal Mulai',
    cell: ({ row }: any) => row.original.tanggal_mulai || '-',
  },
  {
    accessorKey: 'estimasi_biaya',
    header: 'Estimasi Biaya',
    cell: ({ row }: any) => row.original.estimasi_biaya ? `Rp ${parseFloat(row.original.estimasi_biaya).toLocaleString()}` : '-',
  },
  {
    accessorKey: 'biaya_real',
    header: 'Biaya Riil',
    cell: ({ row }: any) => row.original.biaya_real ? `Rp ${parseFloat(row.original.biaya_real).toLocaleString()}` : '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const colors: Record<string, string> = {
        pengajuan: 'bg-yellow-500/10 text-yellow-500',
        proses: 'bg-blue-500/10 text-blue-500',
        selesai: 'bg-green-500/10 text-green-500',
        batal: 'bg-red-500/10 text-red-500',
      }
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${colors[row.original.status] || ''}`}>
          {row.original.status}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => {
      if (row.original.status === 'pengajuan') {
        return canCreate ? (
          <AppButton size="sm" icon={Play} onClick={() => onStart(row.original.id)}>
            Mulai
          </AppButton>
        ) : null
      }
      if (row.original.status === 'proses') {
        return canComplete ? (
          <AppButton size="sm" icon={Check} variant="primary" onClick={() => onFinishClick(row.original.id)}>
            Selesai
          </AppButton>
        ) : null
      }
      return '-'
    },
  },
]
