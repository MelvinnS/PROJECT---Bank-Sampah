import { Bell, Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resolveFotoUrl } from '../../services/api'

export default function Header() {
  const { isGuest, session } = useAuth()
  const navigate = useNavigate()
  const fotoUrl = resolveFotoUrl(session.user?.foto || session.user?.nasabah?.foto)
  const initial = session.user?.namaNasabah?.[0]?.toUpperCase() || session.user?.nama?.[0]?.toUpperCase() || 'N'

  return (
    <header className="sticky top-0 z-10 bg-sand/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <Leaf size={18} strokeWidth={2.25} />
          </span>
          <div className="leading-tight">
            <p className="text-[15px] font-semibold text-ink">Bank Sampah</p>
            <p className="-mt-0.5 text-[15px] font-semibold text-brand-600">Digital</p>
          </div>
        </div>

        {isGuest ? (
          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Masuk / Daftar
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifikasi"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition-colors hover:bg-brand-50"
            >
              <Bell size={18} />
            </button>
            <button
              onClick={() => navigate('/akun')}
              className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700 shadow-sm border border-brand-200 cursor-pointer"
              aria-label="Profil"
            >
              {fotoUrl ? (
                <>
                  <img
                    src={fotoUrl}
                    alt="Profil"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }
                    }}
                  />
                  <div className="h-full w-full items-center justify-center" style={{ display: 'none' }}>
                    {initial}
                  </div>
                </>
              ) : (
                initial
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
