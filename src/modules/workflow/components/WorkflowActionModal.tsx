import React from 'react'
import { AppModal, AppButton, AppTextarea } from '@/components/primitives'
import dayjs from 'dayjs'

interface WorkflowActionModalProps {
  isOpen: boolean
  onClose: () => void
  actionType: 'approve' | 'reject' | null
  notes: string
  setNotes: (notes: string) => void
  onConfirm: () => void
  loadingDetails: boolean
  mutasiData: any
  disposalData: any
  lossData: any
  loanData: any
  selectedApproval: any
}

export function WorkflowActionModal({
  isOpen,
  onClose,
  actionType,
  notes,
  setNotes,
  onConfirm,
  loadingDetails,
  mutasiData,
  disposalData,
  lossData,
  loanData,
  selectedApproval,
}: WorkflowActionModalProps) {
  if (!isOpen || !selectedApproval) return null

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={actionType === 'approve' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
      size="lg"
    >
      <div className="space-y-6 pt-3">
        {/* Loading details */}
        {loadingDetails ? (
          <div className="flex items-center justify-center h-24">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-muted/30 p-4 rounded-xl border border-border text-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
              Detail Data Pengajuan
            </h4>

            {/* Mutasi details */}
            {selectedApproval.workflowInstance.entity_type === 'mutasi' && mutasiData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Aset / Barang</span>
                  <span className="font-semibold text-foreground">
                    {mutasiData.asset?.nama_barang} ({mutasiData.asset?.nomor_register || '-'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Jenis Mutasi</span>
                  <span className="font-semibold text-foreground capitalize">{mutasiData.jenis_mutasi}</span>
                </div>
                {mutasiData.jenis_mutasi === 'unit_kerja' && (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground block">Unit Asal</span>
                      <span className="font-semibold text-foreground">{mutasiData.unitAsal?.nama_unit || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Unit Tujuan</span>
                      <span className="font-semibold text-foreground">{mutasiData.unitTujuan?.nama_unit || '-'}</span>
                    </div>
                  </>
                )}
                {mutasiData.jenis_mutasi === 'penanggung_jawab' && (
                  <>
                    <div>
                      <span className="text-xs text-muted-foreground block">PJ Asal</span>
                      <span className="font-semibold text-foreground">{mutasiData.pjAsal?.nama_lengkap || '-'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">PJ Tujuan</span>
                      <span className="font-semibold text-foreground">{mutasiData.pjTujuan?.nama_lengkap || '-'}</span>
                    </div>
                  </>
                )}
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Alasan Mutasi</span>
                  <p className="mt-1 text-xs text-foreground italic">"{mutasiData.alasan_mutasi || 'Tidak ada alasan'}"</p>
                </div>
              </div>
            )}

            {/* Disposal details */}
            {selectedApproval.workflowInstance.entity_type === 'disposal' && disposalData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Aset / Barang</span>
                  <span className="font-semibold text-foreground">
                    {disposalData.asset?.nama_barang} ({disposalData.asset?.nomor_register || '-'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Perkiraan Nilai Penjualan</span>
                  <span className="font-semibold text-foreground">
                    {disposalData.nilai_penjualan ? `Rp ${parseFloat(disposalData.nilai_penjualan).toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Alasan Penghapusan</span>
                  <p className="mt-1 text-xs text-foreground italic">"{disposalData.alasan_penghapusan}"</p>
                </div>
              </div>
            )}

            {/* Loss details */}
            {selectedApproval.workflowInstance.entity_type === 'loss' && lossData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Aset / Barang</span>
                  <span className="font-semibold text-foreground">
                    {lossData.asset?.nama_barang} ({lossData.asset?.nomor_register || '-'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Nilai Ganti Rugi (TGR)</span>
                  <span className="font-semibold text-foreground">
                    {lossData.nilai_ganti_rugi ? `Rp ${parseFloat(lossData.nilai_ganti_rugi).toLocaleString()}` : 'Belum ditentukan'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Kronologi</span>
                  <p className="mt-1 text-xs text-foreground italic">"{lossData.kronologi}"</p>
                </div>
              </div>
            )}

            {/* Loan details */}
            {selectedApproval.workflowInstance.entity_type === 'loan' && loanData && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground block">Aset / Barang</span>
                  <span className="font-semibold text-foreground">
                    {loanData.asset?.nama_barang} ({loanData.asset?.nomor_register || '-'})
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Peminjam</span>
                  <span className="font-semibold text-foreground">{loanData.peminjam?.nama_lengkap}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Tanggal Rencana Kembali</span>
                  <span className="font-semibold text-foreground">{dayjs(loanData.tanggal_rencana_kembali).format('DD MMM YYYY')}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Tujuan Peminjaman</span>
                  <p className="mt-1 text-xs text-foreground italic">"{loanData.catatan_pengaju || 'Tidak ada catatan'}"</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">
            Catatan / Alasan {actionType === 'reject' && <span className="text-danger">*</span>}
          </label>
          <AppTextarea
            placeholder="Masukkan catatan pendukung persetujuan atau alasan detail penolakan pengajuan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <AppButton variant="outline" onClick={onClose}>
            Batal
          </AppButton>
          <AppButton
            variant={actionType === 'reject' ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            Konfirmasi {actionType === 'approve' ? 'Setuju' : 'Tolak'}
          </AppButton>
        </div>
      </div>
    </AppModal>
  )
}
export default WorkflowActionModal
