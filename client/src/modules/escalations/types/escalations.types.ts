export type EscalationStatus = 'Pending' | 'In Review' | 'Resolved' | 'Cancelled';
export type EscalationLevel = 1 | 2;
export type UserRole = 'HR' | 'HR Admin' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
}

export interface Escalation {
  id: string;
  candidateId: Candidate;
  raisedBy: User;
  assignedTo: User;
  status: EscalationStatus;
  level: EscalationLevel;
  notes: string;
  resolutionComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RaiseEscalationPayload {
  candidateId: string;
  targetUserId: string;
  notes: string;
}

export interface ResolveEscalationPayload {
  resolutionComment: string;
}

export interface EscalationListItem {
  id: string;
  candidateName: string;
  raisedByName: string;
  assignedToName: string;
  status: EscalationStatus;
  level: EscalationLevel;
  createdAt: string;
}

export interface EscalationFilter {
  status?: EscalationStatus;
  level?: EscalationLevel;
  dateFrom?: string;
  dateTo?: string;
}
