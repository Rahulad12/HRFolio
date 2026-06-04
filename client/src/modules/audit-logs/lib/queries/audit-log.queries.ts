import { useQuery } from '@tanstack/react-query'
import * as auditLogApi from '../api/audit-log.api'

const AUDIT_LOGS_KEY = ['audit-logs'] as const

export function useAuditLogList(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, 'full', params],
    queryFn: () => auditLogApi.fetchAuditLogs(params),
    enabled: options?.enabled !== false,
  })
}

export function useScopedAuditLogList(params?: Record<string, unknown>, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, 'scoped', params],
    queryFn: () => auditLogApi.fetchScopedAuditLogs(params),
    enabled: options?.enabled !== false,
  })
}
