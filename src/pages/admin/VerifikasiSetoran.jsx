import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  CheckSquare,
  Search,
  RefreshCw,
  AlertCircle,
  Eye,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAdminSetorList } from '../../services/adminService'
import StatusBadge from '../../components/nasabah/StatusBadge'

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
  { value: 'diverifikasi', label: 'Diverifikasi' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'ditolak', label: 'Ditolak' },
]

export default function VerifikasiSetoran() {
  const navigate = useNavigate()

  // Filters State
  const [statusFilter, setStatusFilter] = useState('')
  const [bulanFilter, setBulanFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Data & UI State
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Month Options (Last 12 months)
  const monthOptions = useMemo(() => {
    const opts = [{ value: '', label: 'Semua Bulan' }]
    const d = new Date()
    for (let i = 0; i < 12; i++) {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      opts.push({
        value: `${year}-${month}`,
        label: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      })
      d.setMonth(d.getMonth() - 1)
    }
    return opts
  }, [])

  // Fetch Data from GET /api/v1/setor-sampah/admin/list?status=...&bulan=...
  const fetchData = useCallback(async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (bulanFilter) params.bulan = bulanFilter

      const res = await getAdminSetorList(params)
      console.log('[VerifikasiSetoran] GET /setor-sampah/admin/list response:', res.data)
      const data = res.data?.data ?? res.data ?? []
      const list = Array.isArray(data) ? data : []
      setDataList(list)
      setCurrentPage(1)
    } catch (err) {
      console.error('[VerifikasiSetoran] Error fetch data:', err)
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Gagal memuat daftar pengajuan setoran.'
      setErrorMsg(msg)
      setDataList([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter, bulanFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Client Search Filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return dataList
    const q = searchQuery.toLowerCase().trim()
    return dataList.filter((item) => {
      const kode = String(item.kodeSetor || item.kode || '').toLowerCase()
      const nama = String(
        item.nasabah?.namaNasabah || item.nasabah?.nama || item.namaNasabah || ''
      ).toLowerCase()
      return kode.includes(q) || nama.includes(q)
    })
  }, [dataList, searchQuery])

  // Pagination Calculation
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredList.slice(start, start + itemsPerPage)
  }, [filteredList, currentPage, itemsPerPage])

  // Format Date Helper
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

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 mb-2 border border-brand-100">
            <CheckSquare size={13} className="text-brand-600" />
            Manajemen Transaksi
          </div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
            Daftar Pengajuan Setoran
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Konfirmasi pengajuan setoran sampah dari nasabah.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          title="Muat ulang data"
          className="self-start sm:self-auto flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-xs hover:border-brand-200 hover:text-brand-700 hover:bg-brand-50/50 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-brand-600' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Card Container */}
      <div className="rounded-3xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {/* Filter Toolbar (Status, Bulan, Search) */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-sand/20">
          <div className="flex flex-wrap items-center gap-3">
            {/* Dropdown Status */}
            <div className="relative min-w-[170px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-8 py-2 text-xs font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Dropdown Bulan */}
            <div className="relative min-w-[170px]">
              <select
                value={bulanFilter}
                onChange={(e) => setBulanFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-3.5 pr-8 py-2 text-xs font-semibold text-ink shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode setor atau nasabah..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3.5 py-2 text-xs text-ink placeholder-gray-400 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-sand/40 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-12">No</th>
                <th className="py-3.5 px-4">Kode Setor</th>
                <th className="py-3.5 px-4">Nama Nasabah</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Estimasi Berat</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading &&
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 text-center">
                      <div className="h-3 w-4 bg-gray-200 rounded mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-28 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-32 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-3.5 w-16 bg-gray-200 rounded ml-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-6 w-24 bg-gray-200 rounded-full mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-7 w-16 bg-gray-200 rounded-lg mx-auto" />
                    </td>
                  </tr>
                ))}

              {!loading && paginatedData.length > 0 &&
                paginatedData.map((item, index) => {
                  const itemId = item.id || item.setorId || item._id
                  const kode =
                    item.kodeSetor ||
                    item.kode ||
                    `SET-${String(itemId || '').slice(0, 8)}`
                  const namaNasabah =
                    item.nasabah?.namaNasabah ||
                    item.nasabah?.nama ||
                    item.namaNasabah ||
                    'Nasabah'
                  const tgl = item.tanggal || item.createdAt
                  const berat = Number(
                    item.totalBeratKg ?? item.totalBerat ?? item.beratKg ?? 0
                  )
                  const status = item.status || 'MENUNGGU_KONFIRMASI'
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1

                  return (
                    <tr
                      key={itemId || kode}
                      className="hover:bg-sand/30 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-400">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-ink group-hover:text-brand-700 transition-colors">
                        {kode}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        {namaNasabah}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {formatDate(tgl)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-ink whitespace-nowrap">
                        {berat} <span className="text-[11px] font-normal text-gray-400">kg</span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <StatusBadge status={status} />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/verifikasi-setoran/${itemId}`)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white px-3 py-1.5 text-xs font-bold border border-brand-200/80 hover:border-brand-600 transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Eye size={13} />
                          <span>Lihat</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && paginatedData.length === 0 && !errorMsg && (
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center text-gray-400">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 mb-3">
              <Inbox size={26} />
            </span>
            <p className="font-bold text-sm text-ink">
              Tidak Ada Data Pengajuan Setoran
            </p>
            <p className="text-xs text-gray-400 max-w-sm mt-0.5">
              {statusFilter || bulanFilter || searchQuery
                ? 'Tidak ditemukan transaksi yang cocok dengan filter yang dipilih.'
                : 'Belum ada pengajuan setoran sampah dari nasabah.'}
            </p>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && filteredList.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-sand/10">
            <div>
              Menampilkan{' '}
              <span className="font-bold text-ink">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              -{' '}
              <span className="font-bold text-ink">
                {Math.min(currentPage * itemsPerPage, filteredList.length)}
              </span>{' '}
              dari <span className="font-bold text-ink">{filteredList.length}</span> data
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
