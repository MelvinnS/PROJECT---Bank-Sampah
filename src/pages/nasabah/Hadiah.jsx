import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Gift,
  Info,
  Package,
  RefreshCw,
  Sparkles,
  Star,
  X,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Copy,
  Check,
  ReceiptText,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDashboardSummary, getHadiah, tukarPoin } from '../../services/nasabahService'
import { resolveFotoUrl } from '../../services/api'
import hadiahBerasImg from '../../assets/images/hadiahberas.jpg'
import hadiahMinyakImg from '../../assets/images/hadiahminyak.jpg'
import hadiahPulsaImg from '../../assets/images/hadiahpulsa.jpg'

/**
 * Helper to determine default photo for gifts based on name & description
 */
function getDefaultGiftPhoto(gift) {
  const name = String(gift?.namaHadiah || gift?.nama || gift?.nama_hadiah || '').toLowerCase()
  const desc = String(gift?.deskripsi || '').toLowerCase()
  const combined = `${name} ${desc}`

  if (combined.includes('beras') || combined.includes('sembako') || combined.includes('pangan')) {
    return hadiahBerasImg
  }
  if (combined.includes('minyak') || combined.includes('goreng') || combined.includes('kelapa')) {
    return hadiahMinyakImg
  }
  if (combined.includes('pulsa') || combined.includes('voucher') || combined.includes('token') || combined.includes('kuota') || combined.includes('data') || combined.includes('pln')) {
    return hadiahPulsaImg
  }
  return hadiahBerasImg
}

// ── Result Modal after Sequential Redemption (Defined OUTSIDE parent) ──
function RedeemResultModal({ result, onClose, onGoToRiwayat }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  if (!result) return null

  const { gift, requestedQty, successes, failures } = result
  const namaHadiah = gift.namaHadiah ?? gift.nama ?? 'Hadiah'
  const isFullSuccess = failures.length === 0 && successes.length > 0
  const isPartialSuccess = successes.length > 0 && failures.length > 0
  const isTotalFailure = successes.length === 0

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-sand/40">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs ${
                isFullSuccess
                  ? 'bg-emerald-600'
                  : isPartialSuccess
                  ? 'bg-amber-500'
                  : 'bg-red-600'
              }`}
            >
              <Gift size={15} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                {isFullSuccess
                  ? 'Penukaran Berhasil!'
                  : isPartialSuccess
                  ? 'Penukaran Sebagian Berhasil'
                  : 'Penukaran Gagal'}
              </h2>
              <p className="text-[11px] text-gray-500">Status Transaksi Penukaran Poin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Main Status Banner */}
          {isFullSuccess && (
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Selamat! Penukaran Poin Berhasil</p>
                <p className="mt-0.5 text-emerald-700">
                  Sebanyak <strong>{successes.length} item</strong> {namaHadiah} berhasil ditukarkan.
                </p>
              </div>
            </div>
          )}

          {isPartialSuccess && (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Penukaran Sebagian Berhasil</p>
                <p className="mt-0.5 text-amber-800">
                  <strong>{successes.length} dari {requestedQty} item</strong> berhasil diproses.
                  Proses dihentikan karena poin atau stok tidak mencukupi untuk item berikutnya.
                </p>
              </div>
            </div>
          )}

          {isTotalFailure && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-800">
              <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Penukaran Tidak Dapat Diproses</p>
                <p className="mt-0.5 text-red-700">
                  {failures[0]?.error || 'Terjadi kesalahan saat memproses penukaran poin.'}
                </p>
              </div>
            </div>
          )}

          {/* List of Generated Codes (If any successes) */}
          {successes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Kode Penukaran ({successes.length} Kode)
                </p>
                <span className="text-[11px] text-gray-400">Gunakan saat pengambilan</span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {successes.map((item, idx) => {
                  const code = item.kodePenukaran || `KODE-${idx + 1}`
                  const isCopied = copiedIndex === idx

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl bg-[#153d23]/5 border border-[#153d23]/15 p-3.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#153d23] text-[10px] font-extrabold text-white shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-[#0f2e1b] tracking-wider truncate select-all">
                          {code}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(code, idx)}
                        className="flex items-center gap-1 rounded-xl bg-white px-2.5 py-1 text-xs font-bold text-[#153d23] border border-[#153d23]/20 hover:bg-[#153d23]/5 transition-colors shadow-2xs cursor-pointer shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-700">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Instructions */}
              <div className="flex items-start gap-2.5 rounded-2xl bg-sand/60 border border-gray-100 p-3 text-xs text-gray-600">
                <Info size={15} className="text-[#153d23] shrink-0 mt-0.5" />
                <p>
                  Tunjukkan kode penukaran di atas kepada petugas Bank Sampah saat mengambil hadiah fisik.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-sand/30 flex items-center justify-between gap-3">
          {successes.length > 0 ? (
            <button
              type="button"
              onClick={onGoToRiwayat}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <ReceiptText size={14} />
              <span>Lihat di Riwayat Penukaran</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#153d23] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0f2e1b] active:scale-95 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Replace Cart Confirmation Dialog ──
function ReplaceCartModal({ pendingGift, currentCart, onConfirm, onCancel }) {
  if (!pendingGift || !currentCart) return null

  const currentName = currentCart.gift?.namaHadiah ?? currentCart.gift?.nama ?? 'Hadiah'
  const pendingName = pendingGift?.namaHadiah ?? pendingGift?.nama ?? 'Hadiah baru'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 animate-scaleUp text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
          <ShoppingCart size={22} />
        </div>
        <h3 className="font-display text-base font-bold text-ink">Ganti Hadiah di Keranjang?</h3>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          Keranjang Anda saat ini berisi <strong>{currentName}</strong> ({currentCart.quantity}x). Apakah Anda ingin menggantinya dengan <strong>{pendingName}</strong>?
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-[#153d23] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0f2e1b] transition-colors cursor-pointer"
          >
            Ya, Ganti
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Hadiah() {
  const { isGuest, isInitializing } = useAuth()
  const navigate = useNavigate()

  // Route Protection
  useEffect(() => {
    if (isGuest) {
      navigate('/login', { state: { from: '/hadiah' }, replace: true })
    }
  }, [isGuest, navigate])

  // States: Summary & Catalog
  const [saldoPoin, setSaldoPoin] = useState(0)
  const [hadiahList, setHadiahList] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // ── Cart State: Single gift with quantity ──
  const [cart, setCart] = useState(null) // { gift, quantity }
  const [pendingReplaceGift, setPendingReplaceGift] = useState(null)

  // ── Execution State ──
  const [redeeming, setRedeeming] = useState(false)
  const [redeemProgress, setRedeemProgress] = useState(null) // { current, total, message }
  const [resultModal, setResultModal] = useState(null)

  // Fetch Data (Saldo & Katalog Hadiah)
  const loadData = useCallback(async () => {
    if (isInitializing || isGuest) return

    setLoading(true)
    setErrorMsg('')

    try {
      // 1. Saldo Poin dari Summary
      const summaryPromise = getDashboardSummary()
        .then((res) => {
          const data = res.data?.data ?? res.data
          const currentPoin = Number(
            data?.saldoPoinSaatIni ?? data?.saldoPoin ?? data?.poin ?? 0
          )
          setSaldoPoin(currentPoin)
        })
        .catch((err) => {
          console.warn('[Hadiah loadData summary error]:', err)
        })

      // 2. Katalog Hadiah
      const hadiahPromise = getHadiah()
        .then((res) => {
          const list = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : []
          setHadiahList(list)
        })
        .catch((err) => {
          console.error('[getHadiah error]:', err.response || err)
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Gagal memuat katalog hadiah.'
          setErrorMsg(msg)
          setHadiahList([])
        })

      await Promise.all([summaryPromise, hadiahPromise])
    } finally {
      setLoading(false)
    }
  }, [isInitializing, isGuest])

  useEffect(() => {
    if (!isInitializing && !isGuest) {
      loadData()
    }
  }, [isInitializing, isGuest, loadData])

  // ── Handle Add to Cart ──
  const handleAddToCart = (gift) => {
    const giftId = String(gift.id ?? gift.hadiahId ?? '')

    if (cart) {
      const currentCartId = String(cart.gift.id ?? cart.gift.hadiahId ?? '')
      if (currentCartId === giftId) {
        // Increment if points & stock allow
        const poin = Number(gift.poinDibutuhkan ?? gift.poin ?? 0)
        const stok = Number(gift.stok ?? gift.stokTersisa ?? 0)
        const nextQty = cart.quantity + 1
        if (nextQty * poin <= saldoPoin && nextQty <= stok) {
          setCart({ gift, quantity: nextQty })
        }
        return
      } else {
        // Prompt replace confirmation
        setPendingReplaceGift(gift)
        return
      }
    }

    // New item in cart
    setCart({ gift, quantity: 1 })
  }

  // ── Handle Replace Cart Confirmation ──
  const handleConfirmReplace = () => {
    if (pendingReplaceGift) {
      setCart({ gift: pendingReplaceGift, quantity: 1 })
      setPendingReplaceGift(null)
    }
  }

  // ── Quantity Controls ──
  const handleIncrementQty = () => {
    if (!cart) return
    const poin = Number(cart.gift.poinDibutuhkan ?? cart.gift.poin ?? 0)
    const stok = Number(cart.gift.stok ?? cart.gift.stokTersisa ?? 0)
    const nextQty = cart.quantity + 1
    if (nextQty * poin <= saldoPoin && nextQty <= stok) {
      setCart({ ...cart, quantity: nextQty })
    }
  }

  const handleDecrementQty = () => {
    if (!cart) return
    if (cart.quantity > 1) {
      setCart({ ...cart, quantity: cart.quantity - 1 })
    } else {
      setCart(null)
    }
  }

  // ── Sequential Redemption Execution ──
  const handleExecuteRedeem = async () => {
    if (!cart || redeeming) return
    const { gift, quantity } = cart
    const giftId = String(gift.id ?? gift.hadiahId ?? '')
    if (!giftId) return

    setRedeeming(true)
    const successes = []
    const failures = []

    // Loop sequential (NOT parallel)
    for (let i = 0; i < quantity; i++) {
      setRedeemProgress({
        current: i + 1,
        total: quantity,
        message: `Memproses ${i + 1} dari ${quantity}...`,
      })

      try {
        const res = await tukarPoin(giftId)
        const resData = res.data?.data ?? res.data
        const kode =
          resData?.kodePenukaran ||
          resData?.kodeTransaksi ||
          resData?.kode ||
          resData?.penukaran?.kodePenukaran ||
          `TRX-OK-${i + 1}`

        successes.push({
          index: i + 1,
          kodePenukaran: kode,
          data: resData,
        })
      } catch (err) {
        console.error(`[Redeem sequential error at step ${i + 1}]:`, err)
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Poin atau stok tidak mencukupi.'

        failures.push({
          index: i + 1,
          error: errorMsg,
        })

        // Stop loop immediately if an error occurs
        break
      }
    }

    setRedeeming(false)
    setRedeemProgress(null)

    // Open Result Modal
    setResultModal({
      gift,
      requestedQty: quantity,
      successes,
      failures,
    })
  }

  // ── Handle Close Result Modal ──
  const handleCloseResultModal = () => {
    setResultModal(null)
    setCart(null)
    loadData() // Refetch balance & updated stock
  }

  // ── Handle Navigate to Riwayat ──
  const handleGoToRiwayat = () => {
    setResultModal(null)
    setCart(null)
    navigate('/riwayat', { state: { activeTab: 'penukaran' } })
  }

  if (isGuest) {
    return null
  }

  // Cart calculations
  const cartPoinUnit = Number(cart?.gift?.poinDibutuhkan ?? cart?.gift?.poin ?? 0)
  const cartTotalPoin = cart ? cartPoinUnit * cart.quantity : 0
  const cartStok = Number(cart?.gift?.stok ?? cart?.gift?.stokTersisa ?? 0)
  const isPlusDisabled =
    !cart ||
    (cart.quantity + 1) * cartPoinUnit > saldoPoin ||
    cart.quantity + 1 > cartStok ||
    redeeming

  return (
    <div className="flex flex-col gap-6 pb-28 max-w-6xl mx-auto">
      {/* Header with Saldo Poin Card at Top Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#153d23]/10 px-3 py-0.5 text-xs font-bold text-[#153d23] mb-2 border border-[#153d23]/20">
            <Gift size={13} className="text-[#153d23]" />
            Katalog Reward Nasabah
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#0f2e1b] tracking-tight">
            Tukar Poin Hadiah
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-lg">
            Pilih hadiah kebutuhan pokok dan tentukan jumlah penukaran menggunakan akumulasi saldo poin Anda.
          </p>
        </div>

        {/* Card Saldo Poin Anda (Kanan Atas) */}
        <div className="self-start sm:self-auto flex items-center gap-3 rounded-2xl bg-white px-5 py-3 border border-[#153d23]/10 shadow-card min-w-[200px]">
          <div>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#153d23]/10 text-[10px] font-bold text-[#153d23] border border-[#153d23]/15 mb-1">
              Saldo Poin Anda
            </span>
            <div className="flex items-center gap-1.5">
              <Star size={18} className="fill-amber-400 text-amber-500 shrink-0" />
              <span className="font-display text-xl font-bold text-[#0f2e1b]">
                {saldoPoin.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-gray-400">Poin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message if fetch failed */}
      {errorMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1 font-bold underline text-red-800 hover:text-red-900 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Coba lagi</span>
          </button>
        </div>
      )}

      {/* Main Content: Gift Cards Grid */}
      <div>
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-ink">
              Pilihan Hadiah
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              ({hadiahList.length} hadiah tersedia)
            </span>
          </div>

          <button
            type="button"
            onClick={loadData}
            title="Muat ulang katalog"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#153d23] hover:text-[#0f2e1b] transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse flex flex-col rounded-3xl bg-white p-3.5 shadow-card border border-gray-100 overflow-hidden"
              >
                <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 mb-3" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2" />
                <div className="h-3 w-1/2 bg-gray-200 rounded-md mb-4" />
                <div className="h-8 w-full bg-gray-200 rounded-full mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && hadiahList.length === 0 && !errorMsg && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 shadow-card border border-gray-100 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#153d23]/10 text-[#153d23] mb-4">
              <Gift size={30} strokeWidth={1.75} />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Belum Ada Hadiah Tersedia</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm">
              Katalog reward saat ini sedang diperbarui oleh administrator. Silakan periksa kembali beberapa saat lagi.
            </p>
          </div>
        )}

        {/* 4-Column Grid List Hadiah */}
        {!loading && hadiahList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {hadiahList.map((gift, idx) => {
              const id = String(gift.id ?? gift.hadiahId ?? gift._id ?? idx)
              const nama = gift.namaHadiah ?? gift.nama ?? 'Hadiah'
              const poinDibutuhkan = Number(gift.poinDibutuhkan ?? gift.poin ?? 0)
              const stok = Number(gift.stok ?? gift.stokTersisa ?? 0)
              const rawFoto = gift.foto || gift.gambar || gift.imageUrl
              const resolvedUrl = resolveFotoUrl(rawFoto)
              const fotoUrl = resolvedUrl ? `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : null
              const deskripsi = gift.deskripsi || ''

              // Conditions
              const isOutOfStock = stok <= 0
              const isNotEnoughPoints = saldoPoin < poinDibutuhkan
              const isSelectedInCart =
                cart && String(cart.gift.id ?? cart.gift.hadiahId ?? '') === id

              return (
                <div
                  key={id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-3.5 shadow-card border transition-all duration-200 ${
                    isSelectedInCart
                      ? 'border-[#153d23] ring-2 ring-[#153d23]/15 shadow-md'
                      : 'border-gray-100 hover:border-[#153d23]/30 hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Compact Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#153d23]/5 to-[#153d23]/10 flex items-center justify-center mb-3">
                      {fotoUrl ? (
                        <>
                          <img
                            src={fotoUrl}
                            alt={nama}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'block'
                              }
                            }}
                          />
                          <img
                            src={getDefaultGiftPhoto(gift)}
                            alt={nama}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{ display: 'none' }}
                          />
                        </>
                      ) : (
                        <img
                          src={getDefaultGiftPhoto(gift)}
                          alt={nama}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Badge Stok */}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-2xs backdrop-blur-xs ${
                            isOutOfStock
                              ? 'bg-red-500/90 text-white'
                              : stok <= 5
                              ? 'bg-amber-500/90 text-white'
                              : 'bg-[#153d23]/80 text-white'
                          }`}
                        >
                          <Package size={10} />
                          {isOutOfStock ? 'Habis' : `Stok: ${stok}`}
                        </span>
                      </div>
                    </div>

                    {/* Title & Info */}
                    <h3 className="font-bold text-xs sm:text-sm text-ink group-hover:text-[#153d23] transition-colors line-clamp-1">
                      {nama}
                    </h3>
                    {deskripsi && (
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                        {deskripsi}
                      </p>
                    )}

                    {/* Points Pill */}
                    <div className="mt-2 flex items-center gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" />
                      <span className="font-display text-sm font-bold text-[#153d23]">
                        {poinDibutuhkan.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">Poin / item</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-3.5 pt-2 border-t border-gray-50">
                    {isOutOfStock ? (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-full bg-gray-100 py-2 text-xs font-bold text-gray-400 cursor-not-allowed"
                      >
                        Stok Habis
                      </button>
                    ) : isNotEnoughPoints ? (
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-full bg-gray-100 py-2 text-xs font-bold text-gray-400 cursor-not-allowed"
                        title={`Saldo poin Anda (${saldoPoin}) kurang`}
                      >
                        Poin Kurang
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={redeeming}
                        onClick={() => handleAddToCart(gift)}
                        className={`w-full rounded-full py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                          isSelectedInCart
                            ? 'bg-[#153d23]/10 text-[#153d23] border border-[#153d23]/30 hover:bg-[#153d23]/15'
                            : 'bg-[#153d23] text-white hover:bg-[#0f2e1b] active:scale-95 shadow-md shadow-[#153d23]/20'
                        }`}
                      >
                        <ShoppingCart size={13} />
                        <span>
                          {isSelectedInCart
                            ? `Dalam Keranjang (${cart.quantity})`
                            : '+ Keranjang'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Bottom Bar / Popup Keranjang with Quantity & Sequential Redeem ── */}
      {cart && (
        <div className="fixed bottom-4 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-3xl mx-auto z-40 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#153d23]/30 p-3.5 sm:p-4 animate-slideUp">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
            {/* Left: Gift Thumbnail & Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#153d23]/5 border border-[#153d23]/20 flex items-center justify-center overflow-hidden shrink-0">
                {resolveFotoUrl(cart.gift.foto || cart.gift.gambar || cart.gift.imageUrl) ? (
                  <>
                    <img
                      src={resolveFotoUrl(cart.gift.foto || cart.gift.gambar || cart.gift.imageUrl)}
                      alt={cart.gift.namaHadiah ?? cart.gift.nama}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'block'
                        }
                      }}
                    />
                    <img
                      src={getDefaultGiftPhoto(cart.gift)}
                      alt={cart.gift.namaHadiah ?? cart.gift.nama}
                      className="h-full w-full object-cover"
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <img
                    src={getDefaultGiftPhoto(cart.gift)}
                    alt={cart.gift.namaHadiah ?? cart.gift.nama}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs sm:text-sm text-[#0f2e1b] truncate">
                  {cart.gift.namaHadiah ?? cart.gift.nama}
                </p>
                <p className="text-[11px] text-gray-500">
                  {cartPoinUnit.toLocaleString('id-ID')} Poin / item
                  {cartStok > 0 && <span className="text-gray-400"> (Sisa stok: {cartStok})</span>}
                </p>
              </div>
            </div>

            {/* Middle & Right: Quantity Controls & Total & Redeem Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-sand/60 p-1 rounded-2xl border border-gray-200/80">
                <button
                  type="button"
                  disabled={redeeming}
                  onClick={handleDecrementQty}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                  title="Kurangi"
                >
                  <Minus size={14} />
                </button>
                <span className="w-7 text-center font-display text-sm sm:text-base font-bold text-[#0f2e1b]">
                  {cart.quantity}
                </span>
                <button
                  type="button"
                  disabled={isPlusDisabled}
                  onClick={handleIncrementQty}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white text-gray-700 hover:bg-gray-100 active:scale-95 transition-all shadow-2xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    (cart.quantity + 1) * cartPoinUnit > saldoPoin
                      ? 'Poin tidak mencukupi untuk menambah quantity'
                      : cart.quantity + 1 > cartStok
                      ? 'Quantity telah mencapai batas stok'
                      : 'Tambah'
                  }
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Total Poin Real-time */}
              <div className="text-right">
                <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400">Total Poin:</p>
                <div className="flex items-center justify-end gap-1">
                  <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" />
                  <span className="font-display text-sm sm:text-base font-bold text-[#153d23]">
                    {cartTotalPoin.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Redeem Button */}
              <button
                type="button"
                disabled={redeeming || cartTotalPoin > saldoPoin || cart.quantity <= 0}
                onClick={handleExecuteRedeem}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#153d23] hover:bg-[#0f2e1b] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#153d23]/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shrink-0"
              >
                {redeeming ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>{redeemProgress?.message || 'Memproses...'}</span>
                  </>
                ) : (
                  <>
                    <span>Tukar Sekarang</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Cancel / Close Cart */}
              <button
                type="button"
                disabled={redeeming}
                onClick={() => setCart(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="Batalkan Keranjang"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Replace Cart Modal Confirmation ── */}
      <ReplaceCartModal
        pendingGift={pendingReplaceGift}
        currentCart={cart}
        onConfirm={handleConfirmReplace}
        onCancel={() => setPendingReplaceGift(null)}
      />

      {/* ── Result Modal after Sequential Execution ── */}
      <RedeemResultModal
        result={resultModal}
        onClose={handleCloseResultModal}
        onGoToRiwayat={handleGoToRiwayat}
      />
    </div>
  )
}
