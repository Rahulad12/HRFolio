import { GET } from '@/shared/lib/axios'
import { AUDIT_LOG_URL } from '@/shared/constants/api'
import type { AuditLogListResponse } from '../../types/audit-log.types'

export async function fetchAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}`, params)
}

export async function fetchScopedAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}/my-scope`, params)
}
