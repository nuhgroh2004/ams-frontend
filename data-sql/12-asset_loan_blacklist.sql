SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO asset_loan_blacklist (id, asset_id, alasan, blocked_by, created_at)
VALUES
  (1, 4, 'Aset sedang dalam perbaikan, tidak boleh dipinjam sementara', 2, NOW())
ON DUPLICATE KEY UPDATE
  asset_id = VALUES(asset_id),
  alasan = VALUES(alasan),
  blocked_by = VALUES(blocked_by),
  created_at = VALUES(created_at);
