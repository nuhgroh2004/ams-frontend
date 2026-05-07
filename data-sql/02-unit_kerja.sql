SET NAMES utf8mb4;
SET time_zone = '+00:00';

INSERT INTO unit_kerja (
  kode, name, created_at, updated_at, hirarki, hirarki_abbr, singkatan,
  is_unor, is_satker, is_subsatker, is_sekretariat, parentKode, jabatan_name,
  pemimpin_non_pns_id, pemimpin_pns_id, eselonId,
  eselon_1_kode, eselon_2_kode, eselon_3_kode, eselon_4_kode
)
VALUES
  (
    '8ae483c573036154017308794fe5181b',
    'Kementerian Pertahanan',
    NOW(), NOW(),
    'Kementerian Pertahanan',
    'Kemhan',
    'KEMHAN',
    1, 0, 0, 0,
    NULL,
    'Menteri Pertahanan',
    NULL, NULL, 1,
    '8ae483c573036154017308794fe5181b', NULL, NULL, NULL
  ),
  (
    '668e203b-fc5a-4488-86ff-b2ef0595508d',
    'BPSDM Kemhan',
    NOW(), NOW(),
    'BPSDM Kemhan - Kementerian Pertahanan',
    'BPSDM Kemhan',
    'BPSDM',
    1, 1, 0, 0,
    '8ae483c573036154017308794fe5181b',
    'Kepala BPSDM',
    NULL, NULL, 2,
    '8ae483c573036154017308794fe5181b', '668e203b-fc5a-4488-86ff-b2ef0595508d', NULL, NULL
  ),
  (
    'd545582f-1766-403e-98fc-bfcc0a92ff27',
    'Dewan Pertahanan Nasional',
    NOW(), NOW(),
    'Dewan Pertahanan Nasional - Kemhan',
    'DPN Kemhan',
    'DPN',
    1, 0, 0, 0,
    NULL,
    'Ketua Dewan',
    NULL, NULL, 3,
    '8ae483c573036154017308794fe5181b', '668e203b-fc5a-4488-86ff-b2ef0595508d', 'd545582f-1766-403e-98fc-bfcc0a92ff27', NULL
  ),
  (
    '3dd9f687-d050-44c6-b348-1138377dcbe2',
    'Sekretariat',
    NOW(), NOW(),
    'Sekretariat - Sekretaris Dpn - Dewan Pertahanan Nasional - Kemhan',
    'Sekretaris Dpn Dewan Pertahanan Nasional Kemhan',
    '',
    0, 0, 0, 1,
    'd545582f-1766-403e-98fc-bfcc0a92ff27',
    'Kepala Sekretariat',
    NULL, 'TNI_NEW_F2D887E01A80E813D9080038DECBBABB', 5,
    '8ae483c573036154017308794fe5181b', '668e203b-fc5a-4488-86ff-b2ef0595508d', 'd545582f-1766-403e-98fc-bfcc0a92ff27', '3dd9f687-d050-44c6-b348-1138377dcbe2'
  ),
  (
    '0f6964a9-7bde-4a02-ba65-3a5971193bce',
    'Bagian Persidangan',
    NULL, '2026-03-04 05:34:13.875496',
    'Bagian Persidangan - Sekretariat - Sekretaris Dpn - Dewan Pertahanan Nasional - Kemhan',
    'Sekretaris Dpn Dewan Pertahanan Nasional Kemhan',
    '',
    0, 0, 0, 0,
    '3dd9f687-d050-44c6-b348-1138377dcbe2',
    'Kepala Bagian Persidangan',
    NULL, 'TNI_NEW_0E087EC55DCBE7B2D7992D6B69B519FB', 7,
    '8ae483c573036154017308794fe5181b', '668e203b-fc5a-4488-86ff-b2ef0595508d', 'd545582f-1766-403e-98fc-bfcc0a92ff27', '3dd9f687-d050-44c6-b348-1138377dcbe2'
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  hirarki = VALUES(hirarki),
  hirarki_abbr = VALUES(hirarki_abbr),
  singkatan = VALUES(singkatan),
  is_unor = VALUES(is_unor),
  is_satker = VALUES(is_satker),
  is_subsatker = VALUES(is_subsatker),
  is_sekretariat = VALUES(is_sekretariat),
  parentKode = VALUES(parentKode),
  jabatan_name = VALUES(jabatan_name),
  pemimpin_non_pns_id = VALUES(pemimpin_non_pns_id),
  pemimpin_pns_id = VALUES(pemimpin_pns_id),
  eselonId = VALUES(eselonId),
  eselon_1_kode = VALUES(eselon_1_kode),
  eselon_2_kode = VALUES(eselon_2_kode),
  eselon_3_kode = VALUES(eselon_3_kode),
  eselon_4_kode = VALUES(eselon_4_kode),
  updated_at = NOW();
