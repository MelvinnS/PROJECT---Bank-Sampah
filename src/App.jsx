import { Routes, Route } from 'react-router-dom'
import { Leaf, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'
import RoleGuard from './components/RoleGuard'

// Nasabah Pages
import Beranda from './pages/nasabah/Beranda'
import KategoriSampah from './pages/nasabah/KategoriSampah'
import Setor from './pages/nasabah/Setor'
import Riwayat from './pages/nasabah/Riwayat'
import Hadiah from './pages/nasabah/Hadiah'
import Profil from './pages/nasabah/Profil'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import DataNasabah from './pages/admin/DataNasabah'
import AdminKategoriSampah from './pages/admin/KategoriSampah'
import VerifikasiSetoran from './pages/admin/VerifikasiSetoran'
import DetailVerifikasiSetoran from './pages/admin/DetailVerifikasiSetoran'
import HadiahAdmin from './pages/admin/Hadiah'
import TransaksiPenukaran from './pages/admin/TransaksiPenukaran'
import VerifikasiPenukaran from './pages/admin/VerifikasiPenukaran'
import Rekapitulasi from './pages/admin/Rekapitulasi'
import ProfilUnit from './pages/admin/ProfilUnit'

// Auth & Shared
import Login from './pages/auth/Login'
import BackgroundFoliage from './components/nasabah/BackgroundFoliage'

export default function App() {
  const { isInitializing, initStatus, initError, retryInit } = useAuth()

  // Display clean branded splash/loading screen while auto-registering App Key & seeding
  if (isInitializing) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-sand px-4 overflow-hidden">
        <BackgroundFoliage />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg animate-pulse mb-4">
            <Leaf size={32} strokeWidth={2.25} />
          </div>
          <h1 className="font-display text-xl font-bold text-ink">Bank Sampah Digital</h1>
          <p className="mt-1 text-xs text-gray-500">{initStatus || 'Menyiapkan koneksi aplikasi...'}</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
            <div className="h-3.5 w-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            <span>Memulai sesi</span>
          </div>
        </div>
      </div>
    )
  }

  // Display error screen if auto-registration failed (e.g. network issue)
  if (initError) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-sand px-4 overflow-hidden">
        <BackgroundFoliage />
        <div className="relative z-10 max-w-sm w-full rounded-3xl bg-white p-6 sm:p-8 shadow-card border border-red-100 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="font-display text-lg font-bold text-ink">Gagal Memulai Aplikasi</h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">{initError}</p>
          <button
            onClick={retryInit}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-[0.99] transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Nasabah Public Routes (Accessible by Nasabah & Guest; Admin redirected to /admin) */}
      <Route
        path="/"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={true}>
            <MainLayout>
              <Beranda />
            </MainLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/kategori-sampah"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={true}>
            <MainLayout>
              <KategoriSampah />
            </MainLayout>
          </RoleGuard>
        }
      />

      {/* Nasabah Protected Routes (Accessible only by Logged-in Nasabah; Admin redirected to /admin) */}
      <Route
        path="/setor"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={false}>
            <MainLayout>
              <Setor />
            </MainLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/riwayat"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={false}>
            <MainLayout>
              <Riwayat />
            </MainLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/hadiah"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={false}>
            <MainLayout>
              <Hadiah />
            </MainLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/akun"
        element={
          <RoleGuard allowRole="NASABAH" allowGuest={false}>
            <MainLayout>
              <Profil />
            </MainLayout>
          </RoleGuard>
        }
      />

      {/* Admin Routes (Accessible only by Admin; Nasabah redirected to /) */}
      <Route
        path="/admin"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/nasabah"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <DataNasabah />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/kategori-sampah"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <AdminKategoriSampah />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/kategori"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <AdminKategoriSampah />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/verifikasi-setoran"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <VerifikasiSetoran />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/verifikasi-setoran/:id"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <DetailVerifikasiSetoran />
            </AdminLayout>
          </RoleGuard>
        }
      />

      <Route
        path="/admin/hadiah"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <HadiahAdmin />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/transaksi-penukaran"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <TransaksiPenukaran />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/verifikasi-penukaran"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <VerifikasiPenukaran />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/penukaran"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <TransaksiPenukaran />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/rekapitulasi"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <Rekapitulasi />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/profil-unit"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <ProfilUnit />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/profil"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <ProfilUnit />
            </AdminLayout>
          </RoleGuard>
        }
      />

      {/* Aliases for convenience */}
      <Route
        path="/admin/verifikasi-setor"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <VerifikasiSetoran />
            </AdminLayout>
          </RoleGuard>
        }
      />
      <Route
        path="/admin/verifikasi-setor/:id"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <DetailVerifikasiSetoran />
            </AdminLayout>
          </RoleGuard>
        }
      />

      {/* Admin Catch-all */}
      <Route
        path="/admin/*"
        element={
          <RoleGuard allowRole="ADMIN">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </RoleGuard>
        }
      />
    </Routes>
  )
}
