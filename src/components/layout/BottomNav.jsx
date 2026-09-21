import { Home, Recycle, ReceiptText, Gift, User } from 'lucide-react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Beranda', icon: Home, guestAllowed: true },
  { to: '/setor', label: 'Setor', icon: Recycle, guestAllowed: false },
  { to: '/riwayat', label: 'Riwayat', icon: ReceiptText, guestAllowed: false },
  { to: '/hadiah', label: 'Tukar Poin', icon: Gift, guestAllowed: false },
  { to: '/akun', label: 'Akun', icon: User, guestAllowed: false },
]

export default function BottomNav() {
  const { isGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e, item) => {
    if (isGuest && !item.guestAllowed) {
      e.preventDefault()
      navigate('/login', { state: { from: item.to } })
    }
  }

  return (
    <nav className="sticky bottom-0 z-10 border-t border-[#153d23]/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(e) => handleClick(e, item)}
              className="flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors"
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 1.9} className={active ? 'text-[#153d23]' : 'text-gray-400'} />
              <span className={active ? 'text-[#153d23] font-bold' : 'text-gray-400'}>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
