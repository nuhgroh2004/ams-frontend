# Asset Management System (AMS) Frontend — BPSDM Kemhan RI

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Aplikasi antarmuka (frontend) modern untuk **Sistem Informasi Manajemen Aset BMN BPSDM Kementerian Pertahanan RI**. Dibangun menggunakan **Next.js 16 (App Router)**, **React 19**, **Apollo Client (GraphQL)**, **Zustand**, dan ditata menggunakan **Tailwind CSS** dengan standar estetika premium ala SaaS Notion.

---

## 🚀 Fitur Utama & Modul Domian

Kode sumber ditata secara modular pada direktori `src/modules`:

* **🔐 Autentikasi & Akun (`src/modules/auth`)**:
  - Halaman login & register terintegrasi token JWT.
  - Pengalihan otomatis berbasis status sesi dan otorisasi.
* **📊 Dashboard Utama (`src/modules/dashboard`)**:
  - **Management Console View** (untuk Admin, Operator BMN, Kepala Unit): Menampilkan ringkasan total aset, status peminjaman aktif, pengingat jadwal perawatan, visual grafik kondisi fisik aset (progress bar), klasifikasi BMN, serta tabel monitoring status aset di tiap unit kerja.
  - **General User Welcome Hub** (untuk User Umum): Tampilan portal personal dengan panduan cepat peminjaman BMN serta tautan jalan pintas aksi pengajuan.
* **🏢 Manajemen Lokasi & Unit Kerja (`src/modules/locations` & `src/modules/unit-kerja`)**:
  - Manajemen master data gedung, lantai, ruangan, kode lokasi, dan unit kerja.
  - Dilengkapi search input instan Notion-style.
* **🔄 Assignment / Penyerahan Aset (`src/modules/transfer`)**:
  - Penugasan aset BMN jangka panjang kepada personel (`User`) maupun unit kerja (`Unit`).
  - Pencatatan pengembalian (return) aset penugasan.
* **🚚 Mutasi Aset (`src/modules/transfer`)**:
  - Pengajuan usulan perpindahan ruangan, unit kerja, atau penanggung jawab aset.
  - Fitur persetujuan/penolakan dengan catatan kelayakan.
  - Pembuatan Berita Acara Serah Terima (BAST) otomatis berbasis PDF, serta upload berkas BAST final bertanda tangan.
* **🤝 Peminjaman BMN (`src/modules/loan`)**:
  - Alur permohonan peminjaman aset jangka pendek beserta integrasi unggah bukti foto serah terima.

---

## 🎨 Desain & UI/UX Standards (Notion-Style)

* **Sleek Modals**: Pop-up dialog (`AppModal`) menggunakan overlay blur minimal (`backdrop-blur-[2px]`), border tipis elegan, dan transisi halus. Pada tampilan mobile, modal otomatis bertransformasi menjadi *bottom drawer* yang mudah dijangkau jempol.
* **Form Grid**: Layout form input (seperti form lokasi) diatur dalam grid 2-kolom responsif untuk memudahkan pengisian data.
* **Unified Action Bars**: Tombol aksi utama (seperti *Tambah Lokasi*) disatukan secara terpadu di dalam bar filter tabel guna mempertahankan kebersihan antarmuka.

---

## 🛠️ Tech Stack

* **Core Framework:** Next.js 16 (Turbopack Enabled) & React 19
* **State Management:** Zustand (Client Session)
* **GraphQL Client:** Apollo Client (HTTP Link & WebSocket Link untuk Real-Time Sync)
* **Styling & Components:** Tailwind CSS, Radix UI Primitives, Lucide Icons, shadcn/ui
* **Form handling:** React Hook Form & Zod Validation
* **Charts:** Recharts

---

## 📁 Struktur Direktori Frontend

```text
ams-frontend/
├── app/                  # Next.js App Router (layout, providers, routing)
├── public/               # File static (logo, default profile images)
├── src/                  
│   ├── components/       # Primitives (Button, Modal, Input) & shared patterns
│   ├── lib/              # Konfigurasi Apollo client, global handler, helper
│   ├── modules/          # Bisnis modul domain (auth, asset, transfer, loan)
│   │   ├── transfer/     # Komponen assignment & mutasi aset
│   │   ├── dashboard/    # Halaman overview & statistika
│   │   └── ...
│   └── types/            # TypeScript type global
```

---

## ⚙️ Cara Menjalankan Project

### 1. Konfigurasi Environment
Salin berkas `.env.example` menjadi `.env` di folder root:
```bash
cp .env.example .env
```
Isi alamat API GraphQL Backend Anda:
```env
NEXT_PUBLIC_GRAPHQL_HTTP_URL="http://localhost:8080/graphql"
NEXT_PUBLIC_GRAPHQL_WS_URL="ws://localhost:8080/graphql"
```

### 2. Instalasi & Development
Pasang dependensi dan jalankan server lokal:
```bash
npm install
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 3. Build Produksi
```bash
npm run build
npm run start
```
