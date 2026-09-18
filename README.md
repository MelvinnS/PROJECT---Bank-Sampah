# Bank Sampah Digital — Frontend (Nasabah & Admin)

Frontend aplikasi **Bank Sampah Digital** berbasis **React + Vite + Tailwind CSS** dengan dukungan penuh untuk role **Nasabah** dan **Admin / Petugas**.

---

## 🚀 Fitur Utama

### 👤 Role Nasabah
- **Beranda (Mode Guest & Nasabah)**: Ringkasan saldo poin, estimasi dampak kg sampah, riwayat setoran ringkas, dan katalog kategori sampah.
- **Katalog Kategori Sampah**: Filter kategori, pencarian real-time, dan bottom sheet detail interaktif dengan preview foto & ikon fallback.
- **Setor Sampah Online**: Formulir input multi-item sampah dinamis dengan preview foto kategori & kalkulasi estimasi poin instan.
- **Riwayat Lengkap**: Tab terpisah antara **Riwayat Setor Sampah** (dengan status verifikasi & detail) dan **Riwayat Penukaran Hadiah** (lengkap dengan kode penukaran).
- **Tukar Poin Hadiah**: Katalog reward, sistem keranjang penukaran kuantitas dinamis, dan kalkulasi sisa poin.
- **Profil & Pengaturan**: Info akun, foto profil tersimpan, ganti password, dan ringkasan kontribusi.

### 🛡️ Role Admin
- **Dashboard Overview**: Metrik realtime total nasabah, total sampah (kg), poin terdistribusi, dan chart tren setoran.
- **Kelola Kategori Sampah**: CRUD kategori sampah (nama, poin/kg, deskripsi, upload foto).
- **Kelola Hadiah**: CRUD hadiah katalog (nama, poin, stok, upload foto).
- **Verifikasi Setoran Sampah**: Daftar setoran menunggu verifikasi, approval / reject dengan input timbangan riil & catatan petugas.
- **Verifikasi Penukaran Poin**: Pencarian kode penukaran hadiah nasabah secara langsung dan penyelesaian status hadiah.
- **Laporan & Rekapitulasi**: Ekspor ringkasan transaksi & data analitik.

---

## ⚙️ Otomasi App Key & Auto-Seed

Aplikasi dilengkapi mekanisme **Auto-Setup App Maker & Auto-Seed**:
1. Saat pertama kali dibuka tanpa App Key, sistem otomatis mendaftarkan tenant baru via API.
2. Segera setelah App Key didapat, sistem memanggil `POST /seed` untuk menginisialisasi kategori sampah, hadiah reward, dan akun administrator default.
3. Status ditandai pada `localStorage` (`seedDone: true`) untuk mencegah duplikasi pemanggilan.
4. Splash screen interaktif menampilkan status *"Menyiapkan data awal..."* secara transparan kepada pengguna.

### 🔑 Kredensial Administrator Default (Hasil Seed):
- **Username**: `admin_banksampah`
- **Password**: `admin123`
- **Role**: `ADMIN`

---

## 💻 Panduan Menjalankan Project

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 3. Build untuk Produksi
```bash
npm run build
```

---

## 🌐 Konfigurasi Lingkungan (.env)

Buat file `.env` di root project jika ingin menggunakan konfigurasi manual:

```env
VITE_API_BASE_URL=https://learn.smktelkom-mlg.sch.id/bank_sampah/api/v1
# VITE_APP_KEY=isi-appkey-manual-jika-tidak-ingin-auto-seed
```

---

## 📁 Struktur Direktori

```
src/
├── assets/            -> Ikon, ilustrasi, dan asset statis
├── components/
│   ├── admin/         -> Komponen tabel, modal, dan kartu khusus Admin
│   ├── layout/        -> Header, BottomNav, AdminSidebar, ProtectedRoute
│   └── nasabah/       -> Komponen kartu saldo, bottom sheet kategori, dll
├── context/
│   ├── AuthContext.jsx -> State auth, token, role, auto-setup & auto-seed
│   └── NotificationContext.jsx -> Toast & notifikasi global
├── pages/
│   ├── admin/         -> Halaman Admin (Dashboard, Verifikasi, Kelola Data, dll)
│   ├── auth/          -> Login & Register Nasabah / Admin
│   └── nasabah/       -> Halaman Nasabah (Beranda, Setor, Riwayat, Hadiah, Profil)
├── services/
│   ├── api.js         -> Axios instance + header x-app-key & Bearer auth interceptors
│   ├── authService.js -> API auth & auto-seed
│   ├── adminService.js -> API endpoint admin
│   └── nasabahService.js -> API endpoint nasabah
├── utils/             -> Helper format rupiah, tanggal, cache-busting foto
├── App.jsx            -> Routing & layout wrapping
└── main.jsx           -> Entry point React
```
