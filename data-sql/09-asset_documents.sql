SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO asset_documents (id, asset_id, nama_dokumen, file_path, jenis_dokumen, uploaded_at)
VALUES
  (1, 1, 'Berita Acara Serah Terima Laptop', 'uploads/assets/documents/sample-ba-laptop.pdf', 'berita_acara', NOW()),
  (2, 3, 'STNK Mobil Operasional', 'uploads/assets/documents/sample-stnk-mobil.pdf', 'stnk', NOW())
ON DUPLICATE KEY UPDATE
  asset_id = VALUES(asset_id),
  nama_dokumen = VALUES(nama_dokumen),
  file_path = VALUES(file_path),
  jenis_dokumen = VALUES(jenis_dokumen),
  uploaded_at = VALUES(uploaded_at);
