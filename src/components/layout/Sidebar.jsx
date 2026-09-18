import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, Recycle, ReceiptText, Gift, User, Leaf, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: Home, guestAllowed: true },
  { to: '/setor', label: 'Setor', icon: Recycle, guestAllowed: false },
  { to: '/riwayat', label: 'Riwayat', icon: ReceiptText, guestAllowed: false },
  { to: '/hadiah', label: 'Tukar Poin', icon: Gift, guestAllowed: false },
  { to: '/akun', label: 'Akun', icon: User, guestAllowed: false },
]

export default function Sidebar({ isOpen, onClose }) {
  const { isGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e, item) => {
    if (onClose) onClose()
    if (isGuest && !item.guestAllowed) {
      e.preventDefault()
      navigate('/login', { state: { from: item.to } })
    }
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 md:w-60 shrink-0 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:min-h-screen md:sticky md:top-0 md:h-screen md:z-20 overflow-y-auto ${
          isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        {/* Logo & Mobile Close Button */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shrink-0">
              <Leaf size={18} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-bold text-ink">Bank Sampah</p>
              <p className="-mt-0.5 text-[14px] font-bold text-brand-600">Digital</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={(e) => handleClick(e, item)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.4 : 1.9}
                  className={active ? 'text-brand-600' : 'text-gray-400'}
                />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Eco Card at Bottom */}
        <div className="px-3 pb-5">
          <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/10 text-brand-600 mb-2">
              <Leaf size={16} strokeWidth={2} />
            </div>
            <p className="text-xs font-semibold text-brand-800 leading-snug">
              Jaga bumi dengan langkah kecil mulai dari kita 🌿
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
