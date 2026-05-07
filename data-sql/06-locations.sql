SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO locations (id, nama_gedung, lantai, ruangan, kode_lokasi, unit_id, created_at, updated_at)
VALUES
  (1, 'Gedung Utama', '2', 'Ruang BMN', 'LOC-BMN-201', 2, NOW(), NOW()),
  (2, 'Gedung Pendidikan', '1', 'Ruang Kelas A', 'LOC-PUSDIK-101', 3, NOW(), NOW()),
  (3, 'Gudang Sarpras', '1', 'Gudang Aset', 'LOC-UPT-101', 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  nama_gedung = VALUES(nama_gedung),
  lantai = VALUES(lantai),
  ruangan = VALUES(ruangan),
  kode_lokasi = VALUES(kode_lokasi),
  unit_id = VALUES(unit_id),
  updated_at = NOW();
