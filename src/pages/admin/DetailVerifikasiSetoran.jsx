import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Scale,
  Save,
  RefreshCw,
  FileText,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAdminSetorDetail, verifyAdminSetor } from '../../services/adminService'
import StatusBadge from '../../components/nasabah/StatusBadge'

const STATUS_CHOICES = [
  { value: 'diverifikasi', label: 'Diverifikasi' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
]

export default function DetailVerifikasiSetoran() {
  const { id } = useParams()
  const navigate = useNavigate()

  // State Data
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Form State
  const [statusVal, setStatusVal] = useState('diverifikasi')
  const [catatanAdmin, setCatatanAdmin] = useState('')
  const [itemsReal, setItemsReal] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Fetch Detail from GET /api/v1/setor-sampah/{id}
  const fetchDetail = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await getAdminSetorDetail(id)
      console.log('[DetailVerifikasiSetoran] GET /setor-sampah/:id response:', res.data)
      const data = res.data?.data ?? res.data

      if (!data) {
        throw new Error('Data pengajuan tidak ditemukan.')
      }

      setDetail(data)

      // Set initial status and catatan (always lowercase)
      const currentStatus = String(data.status || 'diverifikasi').toLowerCase().trim()
      setStatusVal(
        currentStatus === 'menunggu_konfirmasi' || currentStatus === 'pending'
          ? 'diverifikasi'
          : ['diverifikasi', 'selesai', 'ditolak'].includes(currentStatus)
          ? currentStatus
          : 'diverifikasi'
      )
      setCatatanAdmin(data.catatanPetugas || data.catatanAdmin || '')

      // Parse items/detailSetors
      const rawItems = data.detailSetors ?? data.items ?? []
      const initialItems = rawItems.map((it, idx) => {
        const catId = String(
          it.kategoriSampahId ||
            it.kategoriSampah?.id ||
            it.kategoriSampah?.kategoriSampahId ||
            it.id_kategori_sampah ||
            it.id ||
            ''
        )
        const catName =
          it.kategoriSampah?.namaKategori ||
          it.kategoriSampah?.nama ||
          it.namaKategori ||
          it.kategori ||
          `Item #${idx + 1}`
        const beratEstimasi = Number(it.beratKg ?? it.berat ?? 0)
        const beratAktual = Number(it.beratKgReal ?? it.beratReal ?? beratEstimasi)

        return {
          id: it.id || idx,
          kategoriSampahId: catId,
          namaKategori: catName,
          beratEstimasi: beratEstimasi,
          beratKgReal: beratAktual,
        }
      })

      setItemsReal(initialItems)
    } catch (err) {
      console.error('[DetailVerifikasiSetoran] Error fetch detail:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat rincian pengajuan setoran.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  // Handle Weight Input Change
  const handleWeightChange = (index, value) => {
    setItemsReal((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, beratKgReal: value } : item
      )
    )
  }

  // Calculate Totals
  const totalEstimasi = useMemo(() => {
    return (
      Math.round(
        itemsReal.reduce((sum, it) => sum + (parseFloat(it.beratEstimasi) || 0), 0) *
          100
      ) / 100
    )
  }, [itemsReal])

  const totalAktual = useMemo(() => {
    return (
      Math.round(
        itemsReal.reduce((sum, it) => sum + (parseFloat(it.beratKgReal) || 0), 0) *
          100
      ) / 100
    )
  }, [itemsReal])

  // Submit Verification to PUT /api/v1/setor-sampah/admin/verify/{id}
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Validate Weights
    for (let i = 0; i < itemsReal.length; i++) {
      const w = parseFloat(itemsReal[i].beratKgReal)
      if (isNaN(w) || w < 0) {
        setErrorMsg(`Berat aktual pada baris #${i + 1} harus berupa angka valid (minimal 0 kg).`)
        return
      }
    }

    setSubmitting(true)
    try {
      const payload = {
        status: String(statusVal).toLowerCase().trim(),
        catatanAdmin: catatanAdmin.trim() || undefined,
        itemsReal: itemsReal.map((it) => ({
          kategoriSampahId: String(it.kategoriSampahId),
          beratKgReal: parseFloat(it.beratKgReal) || 0,
        })),
      }

      console.log('[verifyAdminSetor payload tepat sebelum request]:', JSON.stringify(payload, null, 2))
      const res = await verifyAdminSetor(id, payload)
      console.log('[DetailVerifikasiSetoran] Response verifikasi sukses:', res.data)

      setSuccessMsg('Verifikasi pengajuan setoran berhasil disimpan!')
      setTimeout(() => {
        navigate('/admin/verifikasi-setoran')
      }, 1200)
    } catch (err) {
      console.error('[DetailVerifikasiSetoran] Error submit verifikasi:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal menyimpan verifikasi setoran. Silakan periksa kembali data.'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Date Formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-3.5 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-3xl bg-white p-6 shadow-card border border-gray-100 h-80 animate-pulse" />
          <div className="lg:col-span-4 rounded-3xl bg-white p-6 shadow-card border border-gray-100 h-80 animate-pulse" />
        </div>
      </div>
    )
  }

  const kodeSetor =
    detail?.kodeSetor || detail?.kode || `SET-${String(id || '').slice(0, 8)}`
  const namaNasabah =
    detail?.nasabah?.namaNasabah ||
    detail?.nasabah?.nama ||
    detail?.namaNasabah ||
    'Nasabah'
  const tanggal = detail?.tanggal || detail?.createdAt
  const totalBeratFromAPI = Number(
    detail?.totalBeratKg ?? detail?.totalBerat ?? totalEstimasi
  )

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Navigation & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/verifikasi-setoran')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-brand-700 hover:border-brand-200 hover:bg-brand-50/50 shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Kembali ke daftar pengajuan"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
                {kodeSetor}
              </h1>
              <StatusBadge status={detail?.status || 'MENUNGGU_KONFIRMASI'} />
            </div>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              <span className="font-bold text-ink">{namaNasabah}</span> · {formatDate(tanggal)} ·{' '}
              <span className="font-semibold text-brand-700">{totalBeratFromAPI} kg (estimasi)</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchDetail}
          title="Muat ulang detail"
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-xs hover:border-brand-200 hover:text-brand-700 transition-all cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 shadow-xs animate-fadeIn">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchDetail}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Rincian Sampah Table */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Scale size={15} />
                </span>
                <h2 className="font-display text-base font-bold text-ink">
                  Rincian Sampah yang Disetor
                </h2>
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {itemsReal.length} jenis item
              </span>
            </div>

            {/* Table Rincian */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-sand/30 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-12">No</th>
                    <th className="py-3 px-4">Jenis Sampah</th>
                    <th className="py-3 px-4 text-right">Estimasi (kg)</th>
                    <th className="py-3 px-4 text-right w-40">Berat Aktual (kg) *</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {itemsReal.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Tidak ada rincian item sampah dalam setoran ini.
                      </td>
                    </tr>
                  ) : (
                    itemsReal.map((item, index) => {
                      return (
                        <tr key={item.id} className="hover:bg-sand/20 transition-colors">
                          <td className="py-3.5 px-3 text-center font-bold text-gray-400">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-ink">
                            {item.namaKategori}
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-gray-500">
                            {item.beratEstimasi} kg
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="relative inline-flex items-center">
                              <input
                                type="number"
                                required
                                step="0.1"
                                min="0"
                                value={item.beratKgReal}
                                onChange={(e) =>
                                  handleWeightChange(index, e.target.value)
                                }
                                className="w-28 rounded-xl border border-gray-200 bg-sand/20 pl-3 pr-7 py-1.5 text-xs font-bold text-ink text-right focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
                              />
                              <span className="absolute right-2.5 text-[11px] font-medium text-gray-400 pointer-events-none">
                                kg
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                {itemsReal.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100 bg-sand/40 font-bold text-xs text-ink">
                      <td colSpan={2} className="py-3.5 px-4 text-left">
                        Total Berat
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-600">
                        {totalEstimasi} kg
                      </td>
                      <td className="py-3.5 px-4 text-right text-brand-700 text-sm">
                        {totalAktual} kg
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Nasabah's Original Note */}
            {detail?.catatan && (
              <div className="mt-5 rounded-2xl bg-sand/40 p-4 border border-gray-100 text-xs">
                <p className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <FileText size={13} className="text-brand-600" />
                  Catatan dari Nasabah:
                </p>
                <p className="text-gray-600 leading-relaxed">{detail.catatan}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Form Ubah Status & Simpan */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-gray-100">
            <div className="pb-3 mb-4 border-b border-gray-100">
              <h2 className="font-display text-base font-bold text-ink">
                Ubah Status
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Pilih keputusan verifikasi untuk setoran ini
              </p>
            </div>

            {/* Dropdown Status */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Status Baru <span className="text-brand-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-sand/20 pl-4 pr-8 py-2.5 text-xs sm:text-sm font-bold text-ink shadow-xs focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
                >
                  {STATUS_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Catatan Admin Textarea */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Catatan Admin <span className="text-xs font-normal text-gray-400">(Opsional)</span>
              </label>
              <textarea
                rows={4}
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                placeholder="Tambahkan catatan jika ada perbedaan berat atau kondisi sampah..."
                className="w-full rounded-2xl border border-gray-200 bg-sand/20 p-3 text-xs text-ink placeholder-gray-400 shadow-xs focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/verifikasi-setoran')}
                disabled={submitting}
                className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 active:scale-95 disabled:opacity-70 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
