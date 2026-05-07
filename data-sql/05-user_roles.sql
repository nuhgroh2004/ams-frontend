SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO user_roles (id, user_id, role_id)
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 4)
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  role_id = VALUES(role_id);
