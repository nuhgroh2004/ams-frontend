import React from 'react'
import { AppButton } from '@/components/primitives'
import { Landmark, Eye } from 'lucide-react'
import { LossReportDTO } from '../types'

interface ColumnOptions {
  canApproveLoss: boolean
  onTGR: (loss: LossReportDTO) => void
  onComplete: (id: string) => void
  onDetail: (loss: LossReportDTO) => void
}

export const getLossReportColumns = ({
  canApproveLoss,
  onTGR,
  onComplete,
  onDetail,
}: ColumnOptions) => [
  {
    accessorKey: 'asset.nama_barang',
    header: 'Aset Hilang',
    cell: ({ row }: any) => (
      <div>
        <p className="font-semibold text-sm">{row.original.asset.nama_barang}</p>
        <p className="text-xs text-muted-foreground">{row.original.asset.nomor_register || '-'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'pelapor.nama_lengkap',
    header: 'Pelapor',
  },
  {
    accessorKey: 'status_proses',
    header: 'Status Kasus',
    cell: ({ row }: any) => {
      const statusMap: Record<string, { label: string; class: string }> = {
        lapor: { label: 'Laporan Masuk', class: 'bg-yellow-500/10 text-yellow-500' },
        proses_tgr: { label: 'Proses TGR', class: 'bg-blue-500/10 text-blue-500' },
        selesai: { label: 'Selesai', class: 'bg-green-500/10 text-green-500' },
        ditolak: { label: 'Ditolak', class: 'bg-red-500/10 text-red-500' },
      }
      const state = statusMap[row.original.status_proses] || { label: 'Draft', class: 'bg-muted text-muted-foreground' }
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${state.class}`}>
          {state.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'nilai_ganti_rugi',
    header: 'Nilai TGR',
    cell: ({ row }: any) => row.original.nilai_ganti_rugi ? `Rp ${parseFloat(row.original.nilai_ganti_rugi).toLocaleString()}` : '-',
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => {
      if (row.original.status_proses === 'proses_tgr' && canApproveLoss) {
        return (
          <div className="flex gap-2">
            <AppButton size="sm" icon={Landmark} onClick={() => onTGR(row.original)}>
              TGR
            </AppButton>
            <AppButton size="sm" variant="outline" onClick={() => onComplete(row.original.id)}>
              Selesai
            </AppButton>
          </div>
        )
      }
      return (
        <AppButton size="sm" variant="outline" icon={Eye} onClick={() => onDetail(row.original)}>
          Detail
        </AppButton>
      )
    },
  },
]
