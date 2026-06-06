export interface AuditLog {
  _id: string
  timestamp: string
  actor: {
    id: string
    name: string
    role: string
  }
  action: string
  target: {
    id: string
    type: string
    name?: string
  }
  metadata?: {
    before?: Record<string, unknown>
    after?: Record<string, unknown>
    comment?: string
  }
  ipAddress?: string
}

export interface AuditLogListResponse {
  success: boolean
  message?: string
  data: {
    logs: AuditLog[]
    total: number
  }
}
