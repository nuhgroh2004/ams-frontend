'use client'

import React from 'react'
import { 
  AppModal,
  AppBadge
} from '@/components/primitives'
import { Procurement } from '../../types'
import { Calendar, User, FileText, Briefcase } from 'lucide-react'

interface ProcurementDetailModalProps {
  isOpen: boolean
  onClose: () => void
  procurement: Procurement | null
}

export function ProcurementDetailModal({
  isOpen,
  onClose,
  procurement
}: ProcurementDetailModalProps) {
  if (!procurement) return null

  const formatRupiah = (value?: string | null) => {
    if (!value) return '-'
    const num = parseFloat(value)
    if (isNaN(num)) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num)
  }

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Transaksi Pengadaan"
      description={`Melihat rincian pengadaan ${procurement.nomor_pengadaan}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Core details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border">
          <div className="flex gap-2">
            <Briefcase className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground block">Vendor / Penyedia</span>
              <span className="text-sm font-semibold text-foreground">{procurement.vendor || '-'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <FileText className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground block">Nomor Kontrak / SPK</span>
              <span className="text-sm font-semibold text-foreground font-mono">{procurement.nomor_kontrak || '-'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Calendar className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground block">Tanggal Pengadaan</span>
              <span className="text-sm font-semibold text-foreground">{procurement.tanggal_pengadaan || '-'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <User className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-muted-foreground block">Dicatat Oleh</span>
              <span className="text-sm font-semibold text-foreground">
                {procurement.createdBy?.nama_lengkap || '-'} (NRP: {procurement.createdBy?.nrp || '-'})
              </span>
            </div>
          </div>
        </div>

        {/* Item details table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Rincian Item Pengadaan
          </h4>

          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nama Barang</th>
                  <th className="px-4 py-3 text-center">Jumlah (Qty)</th>
                  <th className="px-4 py-3 text-right">Harga Satuan</th>
                  <th className="px-4 py-3 text-right">Total Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {procurement.items?.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{item.nama_barang}</td>
                    <td className="px-4 py-3 text-center font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatRupiah(item.harga_satuan)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {formatRupiah(item.total_harga)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30 border-t border-border font-bold text-foreground">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Total Nilai Transaksi</td>
                  <td className="px-4 py-3 text-right text-primary text-base">
                    {formatRupiah(procurement.total_nilai)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </AppModal>
  )
}
