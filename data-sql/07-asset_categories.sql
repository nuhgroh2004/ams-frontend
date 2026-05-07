SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO asset_categories (id, kode_kategori, nama_kategori, umur_manfaat_default)
VALUES
  (1, 'KAT-IT', 'Peralatan Komputer', 5),
  (2, 'KAT-KEND', 'Kendaraan Dinas', 10),
  (3, 'KAT-KOM', 'Peralatan Komunikasi', 5)
ON DUPLICATE KEY UPDATE
  kode_kategori = VALUES(kode_kategori),
  nama_kategori = VALUES(nama_kategori),
  umur_manfaat_default = VALUES(umur_manfaat_default);
