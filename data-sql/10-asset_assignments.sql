SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO asset_assignments (id, asset_id, user_id, unit_id, assigned_at, returned_at, assigned_by, notes)
VALUES
  (1, 1, 4, 2, NOW(), NULL, 2, 'Penugasan laptop untuk staf administrasi'),
  (2, 2, 4, 2, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 2, 'Assignment selesai dan dikembalikan')
ON DUPLICATE KEY UPDATE
  asset_id = VALUES(asset_id),
  user_id = VALUES(user_id),
  unit_id = VALUES(unit_id),
  assigned_at = VALUES(assigned_at),
  returned_at = VALUES(returned_at),
  assigned_by = VALUES(assigned_by),
  notes = VALUES(notes);
