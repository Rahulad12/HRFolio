export type EscalationStatus = 'Pending' | 'In Review' | 'Resolved' | 'Cancelled';
export type EscalationLevel = 1 | 2;

export interface IEscalationRequestDTO {
  candidateId: string;
  targetUserId: string;
  notes: string;
}

export interface IEscalationResolveDTO {
  resolutionComment: string;
}

export interface IEscalationResponseDTO {
  id: string;
  candidateId: any;
  raisedBy: any;
  assignedTo: any;
  status: EscalationStatus;
  level: EscalationLevel;
  notes: string;
  resolutionComment?: string;
  createdAt: Date;
  updatedAt: Date;
}
