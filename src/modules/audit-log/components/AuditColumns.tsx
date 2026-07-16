import React from 'react'
import dayjs from 'dayjs'

export const getAuditColumns = () => [
  {
    accessorKey: 'waktu',
    header: 'Waktu',
    cell: ({ row }: any) => dayjs(row.original.waktu).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    accessorKey: 'user',
    header: 'Pengguna',
    cell: ({ row }: any) => row.original.user?.nama_lengkap || 'Sistem',
  },
  {
    accessorKey: 'aktivitas',
    header: 'Aktivitas',
  },
  {
    accessorKey: 'tabel_terkait',
    header: 'Tabel Terkait',
    cell: ({ row }: any) => row.original.tabel_terkait || '-',
  },
  {
    accessorKey: 'data_id',
    header: 'ID Data',
    cell: ({ row }: any) => row.original.data_id || '-',
  },
  {
    accessorKey: 'ip_address',
    header: 'IP Address',
    cell: ({ row }: any) => row.original.ip_address || '-',
  },
]
