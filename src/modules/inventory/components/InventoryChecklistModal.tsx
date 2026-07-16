import React from 'react'
import { AppModal, AppButton } from '@/components/primitives'
import { FileText } from 'lucide-react'
import { InventoryFullDTO } from '../types'

interface InventoryChecklistModalProps {
  isOpen: boolean
  onClose: () => void
  detailData: InventoryFullDTO | null
  loadingDetails: boolean
  canEdit: boolean
  canSignBAST: boolean
  onVerify: (assetId: string, statusFisik: string) => void
  onCompleteClick: () => void
}

export function InventoryChecklistModal({
  isOpen,
  onClose,
  detailData,
  loadingDetails,
  canEdit,
  canSignBAST,
  onVerify,
  onCompleteClick,
}: InventoryChecklistModalProps) {
  if (!isOpen) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Checklist Fisik: ${detailData?.unit?.nama_unit || ''}`}
      size="lg"
    >
      <div className="space-y-4 pt-3">
        {loadingDetails ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-border overflow-hidden bg-background">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nama Aset</th>
                    <th className="px-4 py-3 font-semibold">No Reg</th>
                    <th className="px-4 py-3 font-semibold text-center">Status Checklist</th>
                    {detailData?.status === 'proses' && canEdit && <th className="px-4 py-3 font-semibold text-right">Verifikasi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detailData?.details.map((d: any) => (
                    <tr key={d.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3.5 font-medium">{d.asset.nama_barang}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{d.asset.nomor_register || '-'}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            d.status_fisik === 'sesuai'
                              ? 'bg-green-500/10 text-green-500'
                              : d.status_fisik === 'rusak'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {d.status_fisik}
                        </span>
                      </td>
                      {detailData?.status === 'proses' && canEdit && (
                        <td className="px-4 py-3.5 text-right space-x-1.5">
                          <AppButton size="sm" onClick={() => onVerify(d.asset.id, 'sesuai')}>
                            Sesuai
                          </AppButton>
                          <AppButton size="sm" variant="outline" onClick={() => onVerify(d.asset.id, 'rusak')}>
                            Rusak
                          </AppButton>
                          <AppButton
                            size="sm"
                            variant="outline"
                            className="border-danger/30 text-danger hover:bg-danger/5"
                            onClick={() => onVerify(d.asset.id, 'tidak_ditemukan')}
                          >
                            Hilang
                          </AppButton>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              {detailData?.berita_acara_path ? (
                <a
                  href={detailData.berita_acara_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Unduh Berita Acara (BAST)
                </a>
              ) : (
                <span className="text-xs text-muted-foreground italic">Belum ada dokumen BAST terunggah.</span>
              )}
              <div className="flex gap-2">
                <AppButton variant="outline" onClick={onClose}>
                  Tutup
                </AppButton>
                {detailData?.status === 'proses' && canSignBAST && (
                  <AppButton onClick={onCompleteClick}>
                    Selesaikan Stock Opname
                  </AppButton>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppModal>
  )
}
