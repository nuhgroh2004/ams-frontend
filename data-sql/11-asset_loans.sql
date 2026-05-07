SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO asset_loans (
  id, asset_id, peminjam_id, approver_id,
  tanggal_pinjam, tanggal_rencana_kembali, tanggal_kembali,
  foto_sebelum, foto_sesudah, catatan_pengaju, catatan_approver, status,
  created_at, updated_at
)
VALUES
  (
    1, 3, 4, 2,
    DATE_SUB(CURDATE(), INTERVAL 3 DAY),
    DATE_ADD(CURDATE(), INTERVAL 4 DAY), NULL,
    'uploads/loans/before-loan-1.jpg', NULL,
    'Dipakai untuk kegiatan operasional unit',
    'Disetujui operator BMN',
    'dipinjam', NOW(), NOW()
  ),
  (
    2, 2, 4, 2,
    DATE_SUB(CURDATE(), INTERVAL 20 DAY),
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    DATE_SUB(CURDATE(), INTERVAL 14 DAY),
    'uploads/loans/before-loan-2.jpg',
    'uploads/loans/after-loan-2.jpg',
    'Peminjaman printer untuk kegiatan pelatihan',
    'Selesai dan aset telah kembali',
    'selesai', NOW(), NOW()
  )
ON DUPLICATE KEY UPDATE
  asset_id = VALUES(asset_id),
  peminjam_id = VALUES(peminjam_id),
  approver_id = VALUES(approver_id),
  tanggal_pinjam = VALUES(tanggal_pinjam),
  tanggal_rencana_kembali = VALUES(tanggal_rencana_kembali),
  tanggal_kembali = VALUES(tanggal_kembali),
  foto_sebelum = VALUES(foto_sebelum),
  foto_sesudah = VALUES(foto_sesudah),
  catatan_pengaju = VALUES(catatan_pengaju),
  catatan_approver = VALUES(catatan_approver),
  status = VALUES(status),
  updated_at = NOW();
