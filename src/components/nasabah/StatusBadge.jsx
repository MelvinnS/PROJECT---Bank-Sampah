import { CheckCircle2, Clock, ShieldCheck, XCircle } from 'lucide-react'

/**
 * Reusable StatusBadge Component
 * Menampilkan badge status transaksi/pengajuan:
 * - Menunggu Konfirmasi: Kuning/Amber
 * - Diverifikasi: Biru
 * - Selesai: Hijau
 * - Ditolak: Merah
 */
export default function StatusBadge({ status, className = '' }) {
  const norm = String(status || '').toLowerCase().trim()

  if (norm.includes('selesai') || norm.includes('completed') || norm.includes('success')) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/80 ${className}`}
      >
        <CheckCircle2 size={13} className="text-emerald-600" />
        Selesai
      </span>
    )
  }

  if (
    norm.includes('verifikasi') ||
    norm.includes('verified') ||
    norm.includes('proses') ||
    norm.includes('progress')
  ) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200/80 ${className}`}
      >
        <ShieldCheck size={13} className="text-blue-600" />
        Diverifikasi
      </span>
    )
  }

  if (norm.includes('tolak') || norm.includes('reject') || norm.includes('cancel')) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200/80 ${className}`}
      >
        <XCircle size={13} className="text-rose-600" />
        Ditolak
      </span>
    )
  }

  // Default: Menunggu Konfirmasi (Pending)
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200/80 ${className}`}
    >
      <Clock size={13} className="text-amber-600" />
      Menunggu Konfirmasi
    </span>
  )
}
