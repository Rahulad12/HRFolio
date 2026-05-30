export type AuditActionType = 
  | 'CANDIDATE_CREATE' | 'CANDIDATE_UPDATE' | 'CANDIDATE_DELETE' | 'CANDIDATE_STAGE_CHANGE' | 'EMAIL_SENT'
  | 'ESCALATION_RAISED' | 'ESCALATION_CANCELLED' | 'ESCALATION_ESCALATED' | 'ESCALATION_RESOLVED'
  | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DEACTIVATE' | 'USER_REACTIVATE' | 'USER_ROLE_CHANGE'
  | 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'AUTH_FAILED_LOGIN';

export interface IAuditLogDTO {
  timestamp: Date;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  action: AuditActionType;
  target: {
    id: string;
    type: string;
    name?: string;
  };
  metadata?: {
    before?: any;
    after?: any;
    comment?: string;
  };
  ipAddress?: string;
}

export interface IAuditLogQuery {
  actorId?: string;
  targetId?: string;
  action?: AuditActionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
