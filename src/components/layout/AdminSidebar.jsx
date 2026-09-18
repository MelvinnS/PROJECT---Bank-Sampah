import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Layers,
  Gift,
  CheckSquare,
  ArrowLeftRight,
  ShieldCheck,
  BarChart3,
  Building2,
  Leaf,
  LogOut,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const ADMIN_MENU_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
  { to: '/admin/nasabah', label: 'Data Nasabah', icon: Users, enabled: true },
  { to: '/admin/kategori-sampah', label: 'Kategori Sampah', icon: Layers, enabled: true },
  { to: '/admin/hadiah', label: 'Hadiah', icon: Gift, enabled: true },
  { to: '/admin/verifikasi-setoran', label: 'Verifikasi Setoran', icon: CheckSquare, enabled: true },
  { to: '/admin/transaksi-penukaran', label: 'Transaksi Penukaran', icon: ArrowLeftRight, enabled: true },
  { to: '/admin/verifikasi-penukaran', label: 'Verifikasi Penukaran', icon: ShieldCheck, enabled: true },
  { to: '/admin/rekapitulasi', label: 'Rekapitulasi', icon: BarChart3, enabled: true },
  { to: '/admin/profil-unit', label: 'Profil Unit', icon: Building2, enabled: true },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout, session } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 md:w-64 shrink-0 bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:min-h-screen md:sticky md:top-0 md:h-screen md:z-20 overflow-y-auto ${
          isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm shrink-0">
              <Leaf size={18} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-bold text-white">Bank Sampah</p>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-brand-500/20 text-[9px] font-bold text-brand-400 border border-brand-500/30">
                  ADMIN
                </span>
              </div>
              <p className="-mt-0.5 text-[14px] font-bold text-brand-400">Digital</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </div>

          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to

            if (!item.enabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 cursor-not-allowed select-none group"
                  title="Menu akan aktif di tahap pengembangan berikutnya"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="text-slate-400" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    Segera
                  </span>
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={active ? 2.4 : 1.9}
                  className={active ? 'text-brand-400' : 'text-slate-400'}
                />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Admin Card & Logout */}
        <div className="px-3 pb-5 space-y-2 border-t border-slate-800 pt-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 shrink-0">
              <Shield size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {session.user?.namaAdmin || session.user?.nama || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400">Pengelola Unit</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  )
}
