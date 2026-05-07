SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO assets (
  id, kode_barang, nomor_register, nama_barang, kategori_id,
  nilai_perolehan, sumber_dana, tahun_perolehan, klasifikasi, kondisi, status_penggunaan,
  lokasi_id, unit_id, penanggung_jawab_id, qr_code_path, gambar_path, created_by,
  created_at, updated_at
)
VALUES
  (1, 'BMN-IT-001', 'REG-2026-000001', 'Laptop Lenovo T14', 1, 18500000.00, 'APBN', 2026, 'intrakomptabel', 'baik', 'aktif', 1, 2, 4, 'uploads/assets/qrcodes/REG-2026-000001.png', NULL, 2, NOW(), NOW()),
  (2, 'BMN-IT-002', 'REG-2026-000002', 'Printer LaserJet Pro', 1, 850000.00, 'APBN', 2026, 'ekstrakomptabel', 'baik', 'aktif', 1, 2, NULL, 'uploads/assets/qrcodes/REG-2026-000002.png', NULL, 2, NOW(), NOW()),
  (3, 'BMN-KEND-001', 'REG-2026-000003', 'Mobil Operasional Unit', 2, 240000000.00, 'APBN', 2025, 'intrakomptabel', 'baik', 'dipinjam', 2, 3, 3, 'uploads/assets/qrcodes/REG-2026-000003.png', NULL, 2, NOW(), NOW()),
  (4, 'BMN-KOM-001', 'REG-2026-000004', 'HT Komunikasi Lapangan', 3, 3500000.00, 'APBN', 2024, 'intrakomptabel', 'rusak_ringan', 'maintenance', 3, 4, NULL, 'uploads/assets/qrcodes/REG-2026-000004.png', NULL, 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  kode_barang = VALUES(kode_barang),
  nomor_register = VALUES(nomor_register),
  nama_barang = VALUES(nama_barang),
  kategori_id = VALUES(kategori_id),
  nilai_perolehan = VALUES(nilai_perolehan),
  sumber_dana = VALUES(sumber_dana),
  tahun_perolehan = VALUES(tahun_perolehan),
  klasifikasi = VALUES(klasifikasi),
  kondisi = VALUES(kondisi),
  status_penggunaan = VALUES(status_penggunaan),
  lokasi_id = VALUES(lokasi_id),
  unit_id = VALUES(unit_id),
  penanggung_jawab_id = VALUES(penanggung_jawab_id),
  qr_code_path = VALUES(qr_code_path),
  gambar_path = VALUES(gambar_path),
  created_by = VALUES(created_by),
  updated_at = NOW();
