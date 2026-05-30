import { useAuth } from '@/shared/hooks/useAuth'
import { AuditLogTable } from './components/AuditLogTable'

export function AuditLogListPage() {
  const { user } = useAuth()
  const isScoped = user?.role === 'HR Admin' || user?.role === 'HR'
  return <AuditLogTable scoped={isScoped} />
}
