import { useState } from 'react'
import { Bell, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

export default function MainLayout({ children }) {
  const { isGuest, session } = useAuth()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const nama = session.user?.namaNasabah || session.user?.nama || 'Nasabah'
  const initial = nama.trim().charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-sand">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Right Side: Topbar + Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 shadow-sm">
          {/* Left: Hamburger Button (Mobile) */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bell */}
            <button
              aria-label="Notifikasi"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell size={18} />
            </button>

            {/* Avatar + Nama */}
            {!isGuest && (
              <button
                onClick={() => navigate('/akun')}
                className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 pl-1 pr-2.5 sm:pr-3 py-1 text-sm font-semibold text-ink hover:bg-brand-50 hover:border-brand-200 transition-colors"
                aria-label="Profil"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 shrink-0">
                  {initial}
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-ink truncate max-w-[110px]">
                  {nama}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {isGuest && (
              <button
                onClick={() => navigate('/login')}
                className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                Masuk
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
