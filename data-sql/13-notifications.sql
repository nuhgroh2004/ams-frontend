SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO notifications (id, user_id, title, message, entity_type, entity_id, is_read, created_at)
VALUES
  (1, 4, 'Peminjaman Aset Disetujui', 'Permintaan peminjaman aset "Mobil Operasional Unit" telah disetujui.', 'asset_loan', 1, FALSE, NOW()),
  (2, 2, 'Aset Telah Dikembalikan', 'Aset "Printer LaserJet Pro" telah dikembalikan oleh peminjam.', 'asset_loan', 2, TRUE, NOW())
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  title = VALUES(title),
  message = VALUES(message),
  entity_type = VALUES(entity_type),
  entity_id = VALUES(entity_id),
  is_read = VALUES(is_read),
  created_at = VALUES(created_at);
