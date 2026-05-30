import { Navigate, Outlet } from 'react-router'
import { Spin } from 'antd'
import { useAuth } from '@/shared/hooks/useAuth'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}
