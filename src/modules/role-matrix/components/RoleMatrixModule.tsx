'use client'

import React, { useState } from 'react'
import { PageShell } from '@/components/patterns'
import { 
  AppCard, 
  AppCardContent, 
  AppButton, 
  AppInput, 
  AppSelect
} from '@/components/primitives'
import { 
  Shield, 
  Search, 
  Layers, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Info, 
  HelpCircle, 
  Users,
  Grid,
  FileText,
  Workflow,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
type RoleType = 'ADMIN_SISTEM' | 'OPERATOR_BMN' | 'KEPALA_UNIT_KERJA' | 'USER_UMUM'

interface PermissionState {
  create: boolean | string
  read: boolean | string
  update: boolean | string
  delete: boolean | string
  approve: boolean | string
  export: boolean | string
  import: boolean | string
  special: string | null
}

interface ModuleConfig {
  name: string
  description: string
  workflowStep?: string
  permissions: Record<RoleType, PermissionState>
}

// Data directly driven by ROLE_MATRIX.md
const ROLES_INFO: Record<RoleType, {
  name: string
  responsibilities: string[]
  specialPermissions: string[]
  workflowSteps: string[]
}> = {
  ADMIN_SISTEM: {
    name: 'ADMIN_SISTEM (Administrator Sistem)',
    responsibilities: [
      'Menjaga keandalan konfigurasi sistem.',
      'Mengelola pengguna dan pemetaan peran (RBAC).',
      'Bertanggung jawab atas otorisasi dan persetujuan tingkat akhir.'
    ],
    specialPermissions: [
      'Mengelola Master Lokasi (CRUD Gedung, Lantai, Ruangan).',
      'Mengatur peran pengguna (UserRole mapping).',
      'Membaca seluruh log aktivitas sistem (Audit Log).',
      'Melakukan persetujuan tingkat akhir (Step 3) pada pengajuan Disposal.'
    ],
    workflowSteps: [
      'Penghapusan BMN (Step 3: Persetujuan Final Admin Sistem BMN)'
    ]
  },
  OPERATOR_BMN: {
    name: 'OPERATOR_BMN (Operator Logistik BMN)',
    responsibilities: [
      'Bertanggung jawab atas keakuratan data inventaris fisik aset BMN dari masuk hingga pencatatan keluar.'
    ],
    specialPermissions: [
      'Mencatat transaksi pengadaan baru (Procurement).',
      'Melakukan input, edit, hapus data aset BMN (termasuk cetak QR Code, upload gambar, dokumen legal).',
      'Melakukan penyerahan aset (Assignment) jangka panjang dan pengembaliannya.',
      'Menyetujui/menolak usulan peminjaman aset jangka pendek dari pengguna umum.',
      'Memulai transaksi peminjaman (foto serah terima awal) dan konfirmasi pengembalian (foto fisik akhir).',
      'Membuat siklus Opname Fisik (Inventory) dan ceklist kecocokan aset lapangan.',
      'Melakukan evaluasi fisik awal (Step 1) pada Disposal dan Laporan Kehilangan.',
      'Mengelola daftar pemblokiran aset (Asset Loan Blacklist).'
    ],
    workflowSteps: [
      'Penghapusan BMN (Step 1: Verifikasi Kelayakan)',
      'Laporan Kehilangan (Step 1: Verifikasi Kronologi)',
      'Peminjaman Aset (Serah Terima Fisik & Pengembalian)',
      'Transfer Aset (Verifikasi BAST & Upload)'
    ]
  },
  KEPALA_UNIT_KERJA: {
    name: 'KEPALA_UNIT_KERJA (Kepala Bidang / Kepala Satker)',
    responsibilities: [
      'Melakukan pengawasan atas penggunaan aset BMN pada unit kerjanya sendiri.',
      'Memberikan rekomendasi kebijakan dan keputusan tingkat unit.'
    ],
    specialPermissions: [
      'Memberikan keputusan rekomendasi menengah (Step 2) pada Disposal dan Laporan Kehilangan.',
      'Menyetujui usulan mutasi ruangan/tanggung jawab yang melibatkan aset unit kerjanya.',
      'Mengekspor laporan aset dan riwayat transaksi unit kerja.'
    ],
    workflowSteps: [
      'Penghapusan BMN (Step 2: Rekomendasi Kepala Unit Kerja)',
      'Laporan Kehilangan (Step 2: Persetujuan Kepala Unit Kerja)'
    ]
  },
  USER_UMUM: {
    name: 'USER_UMUM (Pegawai Pengguna Akhir)',
    responsibilities: [
      'Menjaga dan merawat aset BMN yang didelegasikan kepadanya secara bertanggung jawab.'
    ],
    specialPermissions: [
      'Melihat daftar aset BMN yang secara sah di-assign atas namanya.',
      'Mengajukan peminjaman aset jangka pendek dan membatalkannya jika belum diproses.',
      'Mengusulkan mutasi/pemindahan aset jika dipindahtugaskan atau ruangan berubah.',
      'Melaporkan kehilangan aset BMN bawah tanggung jawabnya ke proses Tuntutan Ganti Rugi (TGR).'
    ],
    workflowSteps: [
      'Peminjam / Pengusul Awal (Loan, Mutasi, Kehilangan)'
    ]
  }
}

const MODULES_CONFIG: ModuleConfig[] = [
  {
    name: 'Dashboard Overview',
    description: 'Memberikan ringkasan data aset BMN secara real-time.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: 'Semua', update: false, delete: false, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: false, read: 'Semua', update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: 'Semua', update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: 'Terbatas', update: false, delete: false, approve: false, export: false, import: false, special: 'Hanya data milik sendiri' }
    }
  },
  {
    name: 'Manajemen Aset (BMN)',
    description: 'Pengelolaan inventaris barang milik negara dari input hingga pencatatan detail.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: true, delete: true, approve: false, export: true, import: true, special: 'Full Access' },
      OPERATOR_BMN: { create: true, read: true, update: true, delete: true, approve: false, export: true, import: true, special: 'Cetak QR Code, Upload Dokumen Legal' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: true, import: false, special: null },
      USER_UMUM: { create: false, read: 'Milik Sendiri', update: false, delete: false, approve: false, export: false, import: false, special: 'Hanya melihat aset di-assign' }
    }
  },
  {
    name: 'Lokasi & Ruangan',
    description: 'Master data gedung, lantai, dan ruangan penyimpanan BMN.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: true, delete: true, approve: false, export: false, import: false, special: 'Kelola Master Lokasi' },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Unit Kerja',
    description: 'Daftar unit kerja / organisasi di lingkungan BPSDM Kemhan.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'User & Peran (Roles)',
    description: 'Manajemen akun pengguna dan pemetaan peran (RBAC).',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: true, delete: true, approve: false, export: false, import: false, special: 'User & Role Mapping' },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Pengadaan Aset (Procurement)',
    description: 'Pencatatan transaksi pengadaan barang dinas baru.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: false, delete: true, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: true, read: true, update: false, delete: true, approve: false, export: false, import: false, special: 'Catat Item Pengadaan' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Penyerahan Aset (Assignment)',
    description: 'Penyerahan aset jangka panjang ke pegawai/unit kerja.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: 'Kembalikan', delete: false, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: true, read: true, update: 'Kembalikan', delete: false, approve: false, export: false, import: false, special: 'Proses Serah Terima & Kembali' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Transfer Aset (Mutasi)',
    description: 'Pemindahan aset antar ruangan, unit kerja, atau penanggung jawab.',
    workflowStep: 'Disetujui oleh salah satu peran manajemen, upload BAST basah/digital oleh Operator.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: 'Approve', delete: false, approve: true, export: false, import: false, special: 'Generate Draft BAST' },
      OPERATOR_BMN: { create: true, read: true, update: 'Approve', delete: false, approve: true, export: false, import: false, special: 'Verifikasi & Upload BAST TTD' },
      KEPALA_UNIT_KERJA: { create: true, read: true, update: 'Approve', delete: false, approve: true, export: false, import: false, special: 'Persetujuan level Unit BAST' },
      USER_UMUM: { create: true, read: 'Usulan Sendiri', update: false, delete: false, approve: false, export: false, import: false, special: 'Ajukan Mutasi Aset Sendiri' }
    }
  },
  {
    name: 'Peminjaman Aset (Loan)',
    description: 'Peminjaman jangka pendek barang dinas (operasional).',
    workflowStep: 'Persetujuan PJ Aset / Operator BMN. Serah terima (foto sebelum) & pengembalian (foto setelah).',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: 'Approve/Serah/Kembali', delete: false, approve: true, export: false, import: false, special: null },
      OPERATOR_BMN: { create: true, read: true, update: 'Approve/Serah/Kembali', delete: false, approve: true, export: false, import: false, special: 'Evaluasi & Serah Terima Foto' },
      KEPALA_UNIT_KERJA: { create: true, read: true, update: 'Approve', delete: false, approve: true, export: false, import: false, special: null },
      USER_UMUM: { create: true, read: 'Milik Sendiri', update: 'Cancel', delete: false, approve: false, export: false, import: false, special: 'Batalkan jika belum diproses' }
    }
  },
  {
    name: 'Perawatan Aset (Maintenance)',
    description: 'Pencatatan pemeliharaan berkala atau perbaikan kerusakan aset.',
    permissions: {
      ADMIN_SISTEM: { create: true, read: true, update: true, delete: true, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: true, read: true, update: true, delete: true, approve: false, export: false, import: false, special: 'Kelola jadwal perawatan' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Inventarisasi (Stock Opname)',
    description: 'Kegiatan opname fisik berkala kecocokan data inventaris.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: true, read: true, update: 'Check Fisik', delete: false, approve: false, export: false, import: false, special: 'Siklus Opname Fisik & BAST' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: 'Akses jika ditunjuk PIC Opname' }
    }
  },
  {
    name: 'Penghapusan (Disposal)',
    description: 'Proses pemusnahan atau penghapusan aset dari daftar BMN karena rusak berat.',
    workflowStep: 'Langkah 1: Verifikasi Operator (Step 1) -> Langkah 2: Rekomendasi Kepala Unit (Step 2) -> Langkah 3: Persetujuan Final Admin (Step 3).',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: 'Final Step', export: false, import: false, special: 'Persetujuan Final (Step 3)' },
      OPERATOR_BMN: { create: true, read: true, update: false, delete: false, approve: 'Step 1', export: false, import: false, special: 'Verifikasi Kelayakan (Step 1)' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: 'Step 2', export: false, import: false, special: 'Rekomendasi Unit (Step 2)' },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: 'Hanya baca dokumen' }
    }
  },
  {
    name: 'Laporan Kehilangan',
    description: 'Pelaporan barang dinas yang hilang untuk diproses ganti rugi.',
    workflowStep: 'Langkah 1: Verifikasi Kronologi Operator (Step 1) -> Langkah 2: Persetujuan Kepala Unit (Step 2) -> Transisi ke TGR.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: 'Step 1', export: false, import: false, special: 'Verifikasi Berita Acara Polisi (Step 1)' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: 'Step 2', export: false, import: false, special: 'Persetujuan TGR (Step 2)' },
      USER_UMUM: { create: true, read: 'Usulan Sendiri', update: false, delete: false, approve: false, export: false, import: false, special: 'Lapor Kehilangan Aset Sendiri' }
    }
  },
  {
    name: 'Kotak Masuk Persetujuan',
    description: 'Daftar antrean persetujuan (inbox) bagi aktor yang berwenang.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: 'Langkah 3', export: false, import: false, special: 'Persetujuan Final' },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: 'Langkah 1', export: false, import: false, special: 'Verifikasi Kelayakan / Kronologi' },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: 'Langkah 2', export: false, import: false, special: 'Rekomendasi Level Unit' },
      USER_UMUM: { create: false, read: false, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Laporan & Ekspor Excel',
    description: 'Export data rekapitulasi aset BMN.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: false, export: true, import: false, special: null },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: false, export: true, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: true, import: false, special: null },
      USER_UMUM: { create: false, read: false, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Audit Log',
    description: 'Log riwayat aktivitas pengguna untuk kebutuhan forensik & audit.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: 'Akses penuh logs' },
      OPERATOR_BMN: { create: false, read: false, update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: false, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: false, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  },
  {
    name: 'Settings',
    description: 'Konfigurasi variabel sistem global, SMTP, dan penyusutan.',
    permissions: {
      ADMIN_SISTEM: { create: false, read: true, update: true, delete: false, approve: false, export: false, import: false, special: 'Akses konfigurasi penuh' },
      OPERATOR_BMN: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      KEPALA_UNIT_KERJA: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null },
      USER_UMUM: { create: false, read: true, update: false, delete: false, approve: false, export: false, import: false, special: null }
    }
  }
]

export function RoleMatrixModule() {
  const [selectedRole, setSelectedRole] = useState<RoleType>('ADMIN_SISTEM')
  const [searchQuery, setSearchQuery] = useState('')
  const [permissionFilter, setPermissionFilter] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<ModuleConfig | null>(MODULES_CONFIG[1]) // Default to Manajemen Aset BMN
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  // Calculations for stats
  const totalRoles = 4
  const totalModules = MODULES_CONFIG.length
  const totalPermissions = MODULES_CONFIG.reduce((acc, mod) => {
    let count = 0
    const perm = mod.permissions[selectedRole]
    if (perm.create) count++
    if (perm.read) count++
    if (perm.update) count++
    if (perm.delete) count++
    if (perm.approve) count++
    if (perm.export) count++
    if (perm.import) count++
    return acc + count
  }, 0)

  // Workflow Roles calculation (number of workflows a role is active in)
  const workflowRoles = Object.values(MODULES_CONFIG).filter(m => m.workflowStep && m.permissions[selectedRole].approve).length

  // Filter & Search Modules
  const filteredModules = MODULES_CONFIG.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          mod.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (permissionFilter === 'all') return matchesSearch

    const perm = mod.permissions[selectedRole]
    if (permissionFilter === 'create') return matchesSearch && perm.create
    if (permissionFilter === 'read') return matchesSearch && perm.read
    if (permissionFilter === 'update') return matchesSearch && perm.update
    if (permissionFilter === 'delete') return matchesSearch && perm.delete
    if (permissionFilter === 'approve') return matchesSearch && perm.approve
    if (permissionFilter === 'export') return matchesSearch && perm.export
    if (permissionFilter === 'import') return matchesSearch && perm.import
    if (permissionFilter === 'special') return matchesSearch && perm.special !== null

    return matchesSearch
  })

  // Helper render premium badge
  const renderBadge = (type: keyof PermissionState, val: boolean | string) => {
    if (!val) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-muted/20 text-muted-foreground/40 border border-border/30 opacity-60">
          <Lock className="h-3 w-3" />
          ✕
        </span>
      )
    }

    let baseStyle = 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap'
    let content = '✓ Allowed'

    if (typeof val === 'string') {
      content = val
    }

    // Different badge variants based on permission type
    if (type === 'create') {
      return <span className={cn(baseStyle, 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20')}>{content}</span>
    }
    if (type === 'read') {
      if (content === 'Terbatas' || content === 'Milik Sendiri' || content === 'Usulan Sendiri') {
        return <span className={cn(baseStyle, 'bg-slate-500/10 text-slate-600 border-slate-500/20 font-medium')}>{content}</span>
      }
      return <span className={cn(baseStyle, 'bg-blue-500/10 text-blue-600 border-blue-500/20')}>{content}</span>
    }
    if (type === 'update') {
      return <span className={cn(baseStyle, 'bg-amber-500/10 text-amber-600 border-amber-500/20')}>{content}</span>
    }
    if (type === 'delete') {
      return <span className={cn(baseStyle, 'bg-rose-500/10 text-rose-600 border-rose-500/20')}>{content}</span>
    }
    if (type === 'approve') {
      if (content.includes('Final') || content.includes('Langkah 3') || content.includes('Step 3')) {
        return <span className={cn(baseStyle, 'bg-violet-600 text-white border-violet-700 shadow-sm shadow-violet-500/10')}>{content}</span>
      }
      return <span className={cn(baseStyle, 'bg-purple-500/10 text-purple-600 border-purple-500/20')}>{content}</span>
    }
    if (type === 'export') {
      return <span className={cn(baseStyle, 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20')}>{content}</span>
    }
    if (type === 'import') {
      return <span className={cn(baseStyle, 'bg-orange-500/10 text-orange-600 border-orange-500/20')}>{content}</span>
    }

    return <span className={cn(baseStyle, 'bg-slate-500/10 text-slate-600 border-slate-500/20')}>{content}</span>
  }

  const roleTabItems: { value: RoleType; label: string }[] = [
    { value: 'ADMIN_SISTEM', label: 'ADMIN SISTEM' },
    { value: 'OPERATOR_BMN', label: 'OPERATOR BMN' },
    { value: 'KEPALA_UNIT_KERJA', label: 'KEPALA UNIT KERJA' },
    { value: 'USER_UMUM', label: 'USER UMUM' }
  ]

  return (
    <PageShell 
      title="Matriks Peran & Hak Akses" 
      description="Tinjau pemetaan peran (RBAC), otorisasi modul, dan tanggung jawab alur kerja di lingkungan AMS Kemhan RI."
    >
      <div className="space-y-6">
        {/* 1. Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AppCard className="bg-gradient-to-br from-card to-muted/20">
            <AppCardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Peran</p>
                <h3 className="text-3xl font-extrabold mt-1 text-foreground">{totalRoles}</h3>
              </div>
              <Users className="h-8 w-8 text-primary/30" />
            </AppCardContent>
          </AppCard>

          <AppCard className="bg-gradient-to-br from-card to-muted/20">
            <AppCardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Modul</p>
                <h3 className="text-3xl font-extrabold mt-1 text-foreground">{totalModules}</h3>
              </div>
              <Grid className="h-8 w-8 text-blue-500/30" />
            </AppCardContent>
          </AppCard>

          <AppCard className="bg-gradient-to-br from-card to-muted/20">
            <AppCardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hak Akses Aktif</p>
                <h3 className="text-3xl font-extrabold mt-1 text-foreground">{totalPermissions}</h3>
              </div>
              <Shield className="h-8 w-8 text-emerald-500/30" />
            </AppCardContent>
          </AppCard>

          <AppCard className="bg-gradient-to-br from-card to-muted/20">
            <AppCardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tanggung Jawab Alur</p>
                <h3 className="text-3xl font-extrabold mt-1 text-foreground">{workflowRoles} Workflow</h3>
              </div>
              <Workflow className="h-8 w-8 text-purple-500/30" />
            </AppCardContent>
          </AppCard>
        </div>

        {/* 2. Role Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/80">
          {roleTabItems.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedRole(tab.value)
                // Set default detail module if none or reset
                setSelectedModule(MODULES_CONFIG[1])
              }}
              className={cn(
                "flex-1 min-w-[140px] py-3 text-xs font-bold rounded-xl transition-all border",
                selectedRole === tab.value
                  ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-card p-4 rounded-2xl border border-border">
          <div className="md:col-span-8">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Cari Modul
            </label>
            <AppInput 
              placeholder="Cari modul atau deskripsi hak akses..."
              icon={Search}
              className="bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-1.5 block">
              Filter Hak Akses
            </label>
            <AppSelect 
              value={permissionFilter}
              onValueChange={setPermissionFilter}
              placeholder="Semua Hak Akses"
              options={[
                { value: 'all', label: 'Semua Hak Akses' },
                { value: 'create', label: 'Dapat Create (C)' },
                { value: 'read', label: 'Dapat Read (R)' },
                { value: 'update', label: 'Dapat Update (U)' },
                { value: 'delete', label: 'Dapat Delete (D)' },
                { value: 'approve', label: 'Dapat Approve' },
                { value: 'export', label: 'Dapat Export' },
                { value: 'import', label: 'Dapat Import' },
                { value: 'special', label: 'Tindakan Khusus' },
              ]}
            />
          </div>
        </div>

        {/* 3. Main Split Panel: Permission Matrix Table (Left) + Detail Panels (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Permission Matrix Table */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead className="bg-muted/80 backdrop-blur sticky top-0 z-10 border-b border-border">
                  <tr>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-4">Modul</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Create</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Read</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Update</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Delete</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Approve</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Export</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Import</th>
                    <th className="p-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-left pl-3">Tindakan Khusus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredModules.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground/60" />
                        <span className="text-xs">Tidak ada modul yang cocok dengan kriteria filter.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredModules.map((mod) => {
                      const p = mod.permissions[selectedRole]
                      const isSelected = selectedModule?.name === mod.name
                      const isExpanded = expandedModule === mod.name

                      return (
                        <React.Fragment key={mod.name}>
                          <tr 
                            onClick={() => setSelectedModule(mod)}
                            className={cn(
                              "hover:bg-muted/30 transition-colors cursor-pointer text-xs",
                              isSelected && "bg-primary/5"
                            )}
                          >
                            {/* Module Name */}
                            <td className="p-3 font-semibold text-foreground pl-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold">{mod.name}</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedModule(isExpanded ? null : mod.name)
                                  }}
                                  className="text-[9px] text-primary hover:underline w-fit mt-0.5 text-left"
                                >
                                  {isExpanded ? 'Sembunyikan deskripsi' : 'Tampilkan deskripsi'}
                                </button>
                              </div>
                            </td>
                            {/* Create */}
                            <td className="p-3 text-center">{renderBadge('create', p.create)}</td>
                            {/* Read */}
                            <td className="p-3 text-center">{renderBadge('read', p.read)}</td>
                            {/* Update */}
                            <td className="p-3 text-center">{renderBadge('update', p.update)}</td>
                            {/* Delete */}
                            <td className="p-3 text-center">{renderBadge('delete', p.delete)}</td>
                            {/* Approve */}
                            <td className="p-3 text-center">{renderBadge('approve', p.approve)}</td>
                            {/* Export */}
                            <td className="p-3 text-center">{renderBadge('export', p.export)}</td>
                            {/* Import */}
                            <td className="p-3 text-center">{renderBadge('import', p.import)}</td>
                            {/* Special Notes / Action */}
                            <td className="p-3 text-left pl-3 text-[11px] text-muted-foreground max-w-[180px] truncate">
                              {p.special ? (
                                <span className="font-medium text-foreground bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                  {p.special}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40 italic">-</span>
                              )}
                            </td>
                          </tr>

                          {/* Expanded Description row */}
                          {isExpanded && (
                            <tr className="bg-muted/10">
                              <td colSpan={9} className="p-3.5 pl-6 border-b border-border/50 text-[11px] text-muted-foreground">
                                <div className="space-y-1">
                                  <p className="font-semibold text-foreground">Deskripsi Modul:</p>
                                  <p>{mod.description}</p>
                                  {mod.workflowStep && (
                                    <p className="mt-1 text-[10px] text-purple-600 font-semibold bg-purple-500/5 px-2 py-1 rounded w-fit border border-purple-500/10">
                                      Keterlibatan Alur: {mod.workflowStep}
                                    </p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panels: Module Detail & Role Detail */}
          <div className="lg:col-span-4 space-y-6">
            {/* Role Detail Panel */}
            <AppCard className="border border-border/80">
              <AppCardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  <h4 className="font-bold text-sm text-foreground">Informasi Peran</h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">Nama Peran</span>
                    <span className="font-extrabold text-foreground text-sm">{ROLES_INFO[selectedRole].name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block mb-1">Tanggung Jawab Utama</span>
                    <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                      {ROLES_INFO[selectedRole].responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block mb-1">Tindakan & Hak Khusus</span>
                    <div className="flex flex-col gap-1">
                      {ROLES_INFO[selectedRole].specialPermissions.map((perm, idx) => (
                        <div key={idx} className="bg-primary/5 p-2 rounded-lg border border-primary/10 text-foreground font-medium flex items-start gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block mb-1">Workflow Tanggung Jawab</span>
                    <div className="flex flex-col gap-1">
                      {ROLES_INFO[selectedRole].workflowSteps.map((step, idx) => (
                        <div key={idx} className="bg-purple-500/5 p-2 rounded-lg border border-purple-500/10 text-purple-700 font-semibold flex items-start gap-1.5">
                          <Workflow className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AppCardContent>
            </AppCard>

            {/* Module Detail Panel */}
            {selectedModule && (
              <AppCard className="border border-border/80 bg-gradient-to-br from-card to-primary/5">
                <AppCardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Layers className="h-4.5 w-4.5 text-primary" />
                    <h4 className="font-bold text-sm text-foreground">Detail Modul</h4>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">Nama Modul</span>
                      <span className="font-extrabold text-foreground text-sm">{selectedModule.name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">Deskripsi</span>
                      <p className="text-muted-foreground leading-relaxed mt-0.5">{selectedModule.description}</p>
                    </div>

                    {selectedModule.workflowStep && (
                      <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl space-y-1">
                        <span className="text-[10px] text-purple-700 uppercase font-bold tracking-widest flex items-center gap-1">
                          <Workflow className="h-3.5 w-3.5 text-purple-600" />
                          Workflow Responsibility
                        </span>
                        <p className="text-[11px] text-purple-900 font-medium leading-relaxed">
                          {selectedModule.workflowStep}
                        </p>
                      </div>
                    )}

                    {selectedModule.permissions[selectedRole].special && (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1">
                        <span className="text-[10px] text-amber-700 uppercase font-bold tracking-widest flex items-center gap-1">
                          <Info className="h-3.5 w-3.5 text-amber-600" />
                          Catatan Otoritas Khusus Peran
                        </span>
                        <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                          {selectedModule.permissions[selectedRole].special}
                        </p>
                      </div>
                    )}

                    {/* Quick Access summary matrix for current role */}
                    <div className="space-y-2 pt-2 border-t border-border/80">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block mb-1.5">
                        Ringkasan Akses ({selectedRole})
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        <div className="flex items-center justify-between p-1.5 rounded bg-muted/40 border border-border/50">
                          <span className="text-muted-foreground">CREATE</span>
                          <span>{selectedModule.permissions[selectedRole].create ? 'YES' : 'NO'}</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-muted/40 border border-border/50">
                          <span className="text-muted-foreground">READ</span>
                          <span>{selectedModule.permissions[selectedRole].read ? 'YES' : 'NO'}</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-muted/40 border border-border/50">
                          <span className="text-muted-foreground">UPDATE</span>
                          <span>{selectedModule.permissions[selectedRole].update ? 'YES' : 'NO'}</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-muted/40 border border-border/50">
                          <span className="text-muted-foreground">DELETE</span>
                          <span>{selectedModule.permissions[selectedRole].delete ? 'YES' : 'NO'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AppCardContent>
              </AppCard>
            )}
          </div>
        </div>

        {/* 4. Workflow Permissions Visualization Section */}
        <AppCard className="border border-border/80 bg-gradient-to-r from-card via-muted/10 to-card">
          <AppCardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Workflow className="h-5 w-5 text-purple-600" />
              <h4 className="font-extrabold text-base text-foreground">Visualisasi Tanggung Jawab Alur Kerja BMN</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Disposal */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">1. Disposal (Penghapusan)</h5>
                  <span className="text-[9px] bg-red-500/10 text-red-600 font-bold px-2 py-0.5 rounded border border-red-500/20">ENGINE</span>
                </div>
                <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-emerald-500 border-emerald-500" />
                    <p className="font-semibold text-foreground leading-none">Step 1: Evaluasi Kelayakan</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-blue-500 border-blue-500" />
                    <p className="font-semibold text-foreground leading-none">Step 2: Rekomendasi Unit Kerja</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: KEPALA_UNIT_KERJA</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-violet-600 border-violet-600" />
                    <p className="font-semibold text-foreground leading-none">Step 3: Persetujuan Final BMN</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: ADMIN_SISTEM</p>
                  </div>
                </div>
              </div>

              {/* Loss Report */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">2. Laporan Kehilangan</h5>
                  <span className="text-[9px] bg-red-500/10 text-red-600 font-bold px-2 py-0.5 rounded border border-red-500/20">ENGINE</span>
                </div>
                <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-emerald-500 border-emerald-500" />
                    <p className="font-semibold text-foreground leading-none">Step 1: Verifikasi Kronologi</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-blue-500 border-blue-500" />
                    <p className="font-semibold text-foreground leading-none">Step 2: Persetujuan Kepala Unit</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: KEPALA_UNIT_KERJA</p>
                  </div>
                </div>
              </div>

              {/* Loan */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">3. Peminjaman Aset (Loan)</h5>
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-500/20">HARDCODED</span>
                </div>
                <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-blue-500 border-blue-500" />
                    <p className="font-semibold text-foreground leading-none">Persetujuan Awal</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN / PJ Aset</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-emerald-500 border-emerald-500" />
                    <p className="font-semibold text-foreground leading-none">Serah Terima & Foto Sebelum</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-slate-500 border-slate-500" />
                    <p className="font-semibold text-foreground leading-none">Pengembalian & Foto Sesudah</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN</p>
                  </div>
                </div>
              </div>

              {/* Transfer */}
              <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-foreground uppercase tracking-wider">4. Transfer Aset (Mutasi)</h5>
                  <span className="text-[9px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-500/20">DIRECT</span>
                </div>
                <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-blue-500 border-blue-500" />
                    <p className="font-semibold text-foreground leading-none">Persetujuan Usulan</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: ADMIN / OPERATOR / KEPALA UNIT</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-purple-500 border-purple-500" />
                    <p className="font-semibold text-foreground leading-none">Generate Draft BAST PDF</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Sistem otomatis</p>
                  </div>
                  <div className="relative text-xs">
                    <span className="absolute -left-[14.5px] top-1 h-2 w-2 rounded-full border-2 bg-emerald-500 border-emerald-500" />
                    <p className="font-semibold text-foreground leading-none">Upload BAST TTD</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Peran: OPERATOR_BMN</p>
                  </div>
                </div>
              </div>
            </div>
          </AppCardContent>
        </AppCard>
      </div>
    </PageShell>
  )
}

// Map alias for AppCard content wrapper compatibility
function AppContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
