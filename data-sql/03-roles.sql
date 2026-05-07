SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO roles (id, nama_role, deskripsi)
VALUES
  (1, 'ADMIN_SISTEM', 'Administrator sistem AMS dengan akses penuh'),
  (2, 'OPERATOR_BMN', 'Operator BMN untuk pengelolaan aset dan peminjaman'),
  (3, 'KEPALA_UNIT_KERJA', 'Pimpinan unit kerja untuk monitoring dan approval'),
  (4, 'USER_UMUM', 'Pengguna umum AMS')
ON DUPLICATE KEY UPDATE
  nama_role = VALUES(nama_role),
  deskripsi = VALUES(deskripsi);
