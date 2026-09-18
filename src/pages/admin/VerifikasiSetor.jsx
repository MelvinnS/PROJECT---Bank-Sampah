import { CheckSquare, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function VerifikasiSetorPlaceholder() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/admin"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Verifikasi &amp; Konfirmasi Setoran
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Daftar pengajuan setoran sampah yang membutuhkan verifikasi petugas.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-12 shadow-card border border-gray-100 text-center flex flex-col items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-3">
          <CheckSquare size={28} />
        </span>
        <h2 className="font-display text-lg font-bold text-ink">
          Halaman Verifikasi Setoran
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mt-1">
          Modul ini telah dipersiapkan dan akan segera diaktifkan pada iterasi pengembangan berikutnya.
        </p>
        <Link
          to="/admin"
          className="mt-5 rounded-full bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
