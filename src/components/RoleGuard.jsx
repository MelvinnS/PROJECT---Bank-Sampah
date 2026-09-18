import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RoleGuard protects routes based on the current user's role.
 * - allowRole: 'ADMIN' | 'NASABAH'
 * - allowGuest: boolean (defaults to false for protected routes, true for public nasabah routes like '/' and '/kategori-sampah')
 */
export default function RoleGuard({ children, allowRole = 'NASABAH', allowGuest = false }) {
  const { session, isGuest } = useAuth()
  const location = useLocation()

  const currentRole = session.role ? String(session.role).toUpperCase() : null

  // 1. Protection for ADMIN routes
  if (allowRole === 'ADMIN') {
    if (isGuest) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }
    if (currentRole !== 'ADMIN') {
      // Nasabah accessing /admin -> redirect to /
      return <Navigate to="/" replace />
    }
    return children
  }

  // 2. Protection for NASABAH routes
  if (allowRole === 'NASABAH') {
    // Admin accessing Nasabah routes -> redirect to /admin
    if (currentRole === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }
    // Guest accessing protected Nasabah routes
    if (!allowGuest && isGuest) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }
    return children
  }

  return children
}
