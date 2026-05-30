import { GET } from '@/shared/lib/axios'
import type { AuditLogListResponse } from '../../types/audit-log.types'

const AUDIT_LOG_URL = 'audit-logs'

export async function fetchAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}`, params)
}

export async function fetchScopedAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}/my-scope`, params)
}
