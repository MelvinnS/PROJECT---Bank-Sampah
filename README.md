# Bank Sampah Digital — Frontend (Nasabah)

Frontend untuk UKK RPL — Aplikasi Bank Sampah Digital, kategori **Frontend (Web)**.
Dibangun dengan React + Vite + Tailwind CSS.

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Konfigurasi API

Salin `.env.example` menjadi `.env`, lalu isi base URL dan App Key sesuai yang diberikan panitia saat ujian:

```
VITE_API_BASE_URL=https://learn.smktelkom-mlg.sch.id/bank_sampah/api/v1
VITE_APP_KEY=isi-appkey-kamu-di-sini
```

## Struktur Folder

```
src/
├── components/
│   ├── layout/       -> Header, BottomNav, MainLayout (dipakai di semua halaman)
│   └── nasabah/       -> Komponen kartu khusus tampilan Nasabah (SaldoPoinCard, dll)
├── context/
│   └── AuthContext.jsx  -> Menyimpan status login (guest / nasabah), token & x-app-key
├── pages/
│   ├── auth/          -> Halaman Login & Register
│   └── nasabah/        -> Semua halaman role Nasabah (Beranda, Setor, Riwayat, dst)
├── services/
│   ├── api.js          -> Axios instance + interceptor header x-app-key & Bearer token
│   └── nasabahService.js -> Kumpulan fungsi pemanggil endpoint API sesuai kontrak
├── App.jsx             -> Routing halaman
└── main.jsx            -> Entry point React

```

## Status Halaman

- ✅ **Beranda** — sudah diimplementasikan penuh, mendukung mode Guest & Nasabah (lihat alur di bawah)
- ⏳ Kategori Sampah, Setor, Riwayat, Hadiah, Profil, Login — masih berupa halaman placeholder, menyusul di tahap berikutnya

## Alur Guest vs Nasabah (Beranda)

- **Guest** (belum login): melihat sapaan umum, ajakan daftar, dan daftar jenis sampah (data publik). Tombol di pojok atas menampilkan "Masuk / Daftar".
- **Nasabah** (sudah login): melihat sapaan personal, kartu saldo poin, ringkasan sampah disetor, dan transaksi terakhir. Tombol di pojok atas berubah jadi ikon notifikasi + avatar.
- Saat guest menekan menu di Bottom Navigation yang butuh akun (Setor, Riwayat, Tukar Poin, Akun), otomatis diarahkan ke halaman Login.
