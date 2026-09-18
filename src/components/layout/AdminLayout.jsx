import { useState } from 'react'
import { Bell, Menu, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  const { session } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const adminName =
    session.user?.namaAdmin ||
    session.user?.nama ||
    session.user?.username ||
    'Admin'
  const initial = adminName.trim().charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-sand text-ink selection:bg-brand-100 selection:text-brand-900">
      {/* Dark Sidebar */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 shadow-xs">
          {/* Left: Hamburger Button (Mobile) & Status Tag */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              aria-label="Buka menu navigasi admin"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-400">Portal Pengelola Bank Sampah</span>
            </div>
          </div>

          {/* Right Actions: Notification + Admin Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Bell */}
            <button
              aria-label="Notifikasi"
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Bell size={18} />
            </button>

            {/* Admin Profile Badge */}
            <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 pl-1 pr-3 py-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shrink-0">
                {initial}
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-ink truncate max-w-[120px]">
                  {adminName}
                </span>
                <span className="text-[10px] font-medium text-gray-400">
                  Pengelola
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
