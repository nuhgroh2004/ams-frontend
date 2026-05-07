SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO units (id, nama_unit, parent_unit_id, kode_unit, created_at, updated_at)
VALUES
  (1, 'BPSDM Kementerian Pertahanan', NULL, 'BPSDM', NOW(), NOW()),
  (2, 'Bagian BMN', 1, 'BMN', NOW(), NOW()),
  (3, 'Pusat Pendidikan', 1, 'PUSDIK', NOW(), NOW()),
  (4, 'UPT Sarana Prasarana', 2, 'UPT-SARPRAS', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  nama_unit = VALUES(nama_unit),
  parent_unit_id = VALUES(parent_unit_id),
  kode_unit = VALUES(kode_unit),
  updated_at = NOW();
