import { Navigate, Outlet } from 'react-router'
import { Spin } from 'antd'
import { useAuth } from '@/shared/hooks/useAuth'
import { usePermissions } from '@/shared/hooks/usePermissions'

interface Props {
  allowedRoles?: string[]
  requiredPermission?: string
}

export function ProtectedRoute({ allowedRoles, requiredPermission }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { can, isLoaded } = usePermissions()

  if (isLoading || (isAuthenticated && !isLoaded)) {
    return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
