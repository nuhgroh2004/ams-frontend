'use client'

import React from 'react'
import { PageShell } from '@/components/patterns'
import {
  AppCard,
  AppCardContent,
  AppButton,
  AppBadge
} from '@/components/primitives'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { hasPermissionForUser } from '@/lib/permissions'
import { useQuery } from '@apollo/client'
import { GET_DASHBOARD_OVERVIEW } from '../services/dashboard.query'
import { DashboardOverview } from '../types'
import {
  LayoutDashboard,
  ShieldAlert,
  Calendar,
  Building,
  ArrowUpRight,
  Handshake,
  ArrowRightLeft,
  User as UserIcon,
  Package,
  Wrench,
  AlertTriangle,
  Award
} from 'lucide-react'
import Link from 'next/link'

export function DashboardModule() {
  const { user } = useAuth()
  const currentUser = useAuthStore((state) => state.user)

  // Show management dashboard (analytics) to users with report:view permission
  const isManagement = hasPermissionForUser(currentUser, 'report:view')

  const { data, loading, error } = useQuery<{ dashboardOverview: DashboardOverview }>(
    GET_DASHBOARD_OVERVIEW,
    {
      variables: { batas_tahun_perawatan: 1 },
      skip: !isManagement, // skip query if not admin/operator/head of unit
      fetchPolicy: 'network-only'
    }
  )

  const overview = data?.dashboardOverview

  // Total BMN Calculation (Sum of categories)
  const totalAssets = overview?.total_aset_per_kategori?.reduce((sum, item) => sum + item.total, 0) || 0

  if (!isManagement) {
    // General User Welcome Hub
    return (
      <PageShell
        title="Dashboard Utama"
        description="Selamat datang di Sistem Informasi Manajemen Aset BMN BPSDM Kemhan."
      >
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-orange-600 p-6 sm:p-8 text-white shadow-lg border border-primary/20">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
              <LayoutDashboard className="h-64 w-64" />
            </div>
            <div className="relative space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                <Award className="h-3.5 w-3.5" />
                <span>Pengguna Terverifikasi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Halo, {user?.nama_lengkap || 'Rekan Kerja'}!
              </h2>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Anda login sebagai <strong className="font-bold">{user?.roles?.[0]?.nama_role || 'USER_UMUM'}</strong>. Melalui portal ini, Anda dapat memantau status peminjaman aset serta mengajukan usulan pemindahan / mutasi aset.
              </p>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AppCard className="group hover:border-primary/40 hover:shadow-md transition-all duration-300">
              <AppCardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Handshake className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Pinjam Aset Jangka Pendek</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajukan peminjaman laptop, projector, kendaraan, atau ruang rapat untuk kebutuhan dinas.
                  </p>
                </div>
                <Link href="/dashboard/peminjaman" className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  Ajukan Peminjaman <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </AppCardContent>
            </AppCard>

            <AppCard className="group hover:border-info/40 hover:shadow-md transition-all duration-300">
              <AppCardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20 text-info group-hover:bg-info group-hover:text-white transition-colors">
                  <ArrowRightLeft className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Mutasi Aset</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Laporkan pemindahan fisik aset ke ruangan lain atau mutasi penanggung jawab aset.
                  </p>
                </div>
                <Link href="/dashboard/mutasi" className="inline-flex items-center text-xs font-bold text-info group-hover:translate-x-1 transition-transform">
                  Ajukan Mutasi <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </AppCardContent>
            </AppCard>

            <AppCard className="group hover:border-neutral-400 hover:shadow-md transition-all duration-300">
              <AppCardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center border border-border text-muted-foreground group-hover:bg-foreground group-hover:text-white transition-colors">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Profil & Jabatan</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lihat detail jabatan, unit kerja tempat Anda bertugas, serta kata sandi akun.
                  </p>
                </div>
                <Link href="/dashboard/profile" className="inline-flex items-center text-xs font-bold text-foreground group-hover:translate-x-1 transition-transform">
                  Lihat Profil <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </AppCardContent>
            </AppCard>
          </div>

          {/* Quick Guidelines */}
          <AppCard>
            <AppCardContent className="pt-6 space-y-4">
              <h3 className="font-bold text-base border-b border-border pb-2 text-foreground">Panduan Cepat Peminjaman BMN</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div className="space-y-1.5">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                    Pilih Barang & Ajukan
                  </div>
                  <p className="text-xs leading-relaxed">Pilih aset aktif dan masukkan tanggal rencana kembali beserta catatan tujuan penggunaan barang.</p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                    Persetujuan Operator BMN
                  </div>
                  <p className="text-xs leading-relaxed">Operator akan memeriksa kelayakan permohonan. Anda akan menerima notifikasi status persetujuan.</p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                    Serah Terima Bukti Foto
                  </div>
                  <p className="text-xs leading-relaxed">Saat mengambil dan mengembalikan barang, lampirkan bukti foto kondisi fisik aset terkini.</p>
                </div>
              </div>
            </AppCardContent>
          </AppCard>
        </div>
      </PageShell>
    )
  }

  // Management Console View (ADMIN, OPERATOR, KEPALA UNIT)
  return (
    <PageShell
      title="Dashboard Monitoring"
      description="Ringkasan dan agregasi status aset BMN secara real-time."
    >
      <div className="space-y-6">
        {/* Loading / Error States */}
        {loading && (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground font-semibold">Memuat dashboard...</span>
            </div>
          </div>
        )}

        {error && (
          <AppCard variant="alert">
            <AppCardContent className="flex items-center gap-3 pt-5 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-medium">Gagal memuat ringkasan dashboard: {error.message}</p>
            </AppCardContent>
          </AppCard>
        )}

        {overview && (
          <>
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Aset */}
              <AppCard className="bg-card relative overflow-hidden border-border/80">
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 text-primary">
                  <Package className="h-32 w-32" />
                </div>
                <AppCardContent className="pt-6">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Total Aset Tercatat</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-foreground">{totalAssets}</span>
                    <span className="text-xs text-muted-foreground font-medium">Barang</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/60 pt-2">
                    Tersebar di {overview.total_aset_per_kategori?.length || 0} kategori aset BMN
                  </div>
                </AppCardContent>
              </AppCard>

              {/* Aset Dipinjam */}
              <AppCard className="bg-card relative overflow-hidden border-border/80">
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 text-info">
                  <Handshake className="h-32 w-32" />
                </div>
                <AppCardContent className="pt-6">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Sedang Dipinjam</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-info">
                      {overview.aset_dipinjam_dan_belum_kembali}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Transaksi Aktif</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/60 pt-2 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-info rounded-full inline-block animate-pulse" />
                    Peminjaman jangka pendek belum dikembalikan
                  </div>
                </AppCardContent>
              </AppCard>

              {/* Butuh Perawatan */}
              <AppCard className="bg-card relative overflow-hidden border-border/80">
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-5 text-warning">
                  <Wrench className="h-32 w-32" />
                </div>
                <AppCardContent className="pt-6">
                  <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">Mendekati Perawatan</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-warning">
                      {overview.aset_mendekati_jadwal_perawatan}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Barang</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2 border-t border-border/60 pt-2">
                    Berdasarkan selisih umur manfaat aset & kategori (1 tahun)
                  </div>
                </AppCardContent>
              </AppCard>
            </div>

            {/* Visual Indicators & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kondisi Aset */}
              <AppCard>
                <AppCardContent className="pt-6 space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Kondisi Fisik Aset</h3>
                  </div>

                  <div className="space-y-4">
                    {overview.status_kondisi_aset?.map((k) => {
                      const totalKondisi = k.total
                      const percentage = totalAssets > 0 ? Math.round((totalKondisi / totalAssets) * 100) : 0
                      
                      let colorClass = 'bg-success'
                      let label = k.kondisi.replace('_', ' ')
                      
                      if (k.kondisi === 'rusak_ringan') colorClass = 'bg-warning'
                      if (k.kondisi === 'rusak_berat') colorClass = 'bg-destructive'

                      return (
                        <div key={k.kondisi} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-foreground capitalize">{label}</span>
                            <span className="text-muted-foreground font-medium">{totalKondisi} Unit ({percentage}%)</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                    {(!overview.status_kondisi_aset || overview.status_kondisi_aset.length === 0) && (
                      <p className="text-xs text-muted-foreground text-center py-4">Data kondisi kosong</p>
                    )}
                  </div>
                </AppCardContent>
              </AppCard>

              {/* Klasifikasi Intra & Ekstra */}
              <AppCard>
                <AppCardContent className="pt-6 space-y-5">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <Calendar className="h-4.5 w-4.5 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Klasifikasi Barang BMN</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {overview.klasifikasi_intra_ekstra?.map((k) => {
                      const totalKlasifikasi = k.total
                      const percentage = totalAssets > 0 ? Math.round((totalKlasifikasi / totalAssets) * 100) : 0

                      return (
                        <div key={k.klasifikasi} className="bg-muted/20 border border-border/60 rounded-xl p-4 text-center space-y-2">
                          <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">
                            {k.klasifikasi}
                          </span>
                          <p className="text-2xl font-extrabold text-foreground">{totalKlasifikasi}</p>
                          <AppBadge variant={k.klasifikasi === 'intrakomptabel' ? 'info' : 'neutral'} className="text-[10px] font-semibold">
                            {percentage}% Dari Aset
                          </AppBadge>
                        </div>
                      )
                    })}
                    {(!overview.klasifikasi_intra_ekstra || overview.klasifikasi_intra_ekstra.length === 0) && (
                      <p className="text-xs text-muted-foreground text-center py-4 col-span-2">Data klasifikasi kosong</p>
                    )}
                  </div>
                </AppCardContent>
              </AppCard>
            </div>

            {/* Monitoring Per Unit Kerja */}
            <AppCard>
              <AppCardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Building className="h-4.5 w-4.5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Monitoring Aset Per Unit Kerja</h3>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs text-muted-foreground font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3">Unit Kerja</th>
                        <th className="px-4 py-3 text-center">Total Aset</th>
                        <th className="px-4 py-3 text-center">Aktif</th>
                        <th className="px-4 py-3 text-center">Dipinjam</th>
                        <th className="px-4 py-3 text-center">Perawatan</th>
                        <th className="px-4 py-3 text-center">Dihapus / Hilang</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {overview.monitoring_aset_per_unit_kerja?.map((u) => (
                        <tr key={u.unit_id || 'unassigned'} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-foreground">{u.nama_unit}</td>
                          <td className="px-4 py-3.5 text-center font-bold">{u.total_aset}</td>
                          <td className="px-4 py-3.5 text-center">
                            <AppBadge variant="success" className="text-[10px]">{u.aset_aktif}</AppBadge>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <AppBadge variant="info" className="text-[10px]">{u.aset_dipinjam}</AppBadge>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <AppBadge variant="warning" className="text-[10px]">{u.aset_maintenance}</AppBadge>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="text-xs font-semibold text-muted-foreground">
                              {u.aset_dihapus + u.aset_hilang} Unit
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(!overview.monitoring_aset_per_unit_kerja || overview.monitoring_aset_per_unit_kerja.length === 0) && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-muted-foreground text-xs">
                            Tidak ada data monitoring per unit
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AppCardContent>
            </AppCard>
          </>
        )}
      </div>
    </PageShell>
  )
}
