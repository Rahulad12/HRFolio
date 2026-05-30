import { Escalation } from '../model/Escalation';
import { IEscalationRequestDTO, IEscalationResolveDTO, IEscalationResponseDTO } from '../types/escalations.types';
import Candidate from '../../legacy/model/Candidate.js';
import User from '../../legacy/model/User.js';
import { auditLogService } from '../../audit-logs/index.js';

export class EscalationService {
  /**
   * Raise a Level 1 escalation (HR -> HR Admin)
   */
  async raiseLevel1(actor: any, dto: IEscalationRequestDTO): Promise<IEscalationResponseDTO> {
    const candidate = await Candidate.findById(dto.candidateId);
    if (!candidate) throw new Error("Candidate not found");

    // Ownership check (only owner can raise escalation)
    if (candidate.createdBy?.toString() !== actor.id) {
      throw new Error("Only the candidate owner can raise an escalation");
    }

    // Duplicate guard: one active escalation per (candidate, targetHRAdmin) pair
    const existing = await Escalation.findOne({
      candidateId: dto.candidateId,
      assignedTo: dto.targetUserId,
      status: { $in: ['Pending', 'In Review'] },
    });
    if (existing) {
      throw new Error(
        "An active escalation already exists for this candidate with the selected HR Admin"
      );
    }

    const targetUser = await User.findById(dto.targetUserId);
    if (!targetUser || targetUser.role !== 'HR Admin') {
      throw new Error("Target user must be an HR Admin");
    }

    const escalation = await Escalation.create({
      candidateId: dto.candidateId,
      raisedBy: actor.id,
      assignedTo: dto.targetUserId,
      level: 1,
      notes: dto.notes,
      status: 'Pending'
    });

    await auditLogService.log({
      actor: { id: actor.id, name: actor.name || 'Unknown', role: actor.role },
      action: 'ESCALATION_RAISED',
      target: { id: escalation._id as any, type: 'escalations', name: `Escalation for ${candidate.name}` },
      metadata: { after: dto }
    });

    return this.mapToDTO(escalation);
  }

  /**
   * Escalate to Level 2 (HR Admin -> Admin)
   */
  async escalateToLevel2(actor: any, escalationId: string, dto: IEscalationRequestDTO): Promise<IEscalationResponseDTO> {
    const parentEscalation = await Escalation.findById(escalationId).populate('candidateId');
    if (!parentEscalation || parentEscalation.status === 'Resolved' || parentEscalation.status === 'Cancelled') {
      throw new Error("Active Level 1 escalation required");
    }

    if (parentEscalation.assignedTo.toString() !== actor.id) {
      throw new Error("Only the assigned HR Admin can escalate to Level 2");
    }

    const targetUser = await User.findById(dto.targetUserId);
    if (!targetUser || targetUser.role !== 'Admin') {
      throw new Error("Target user must be an Admin");
    }

    const level2Escalation = await Escalation.create({
      candidateId: parentEscalation.candidateId,
      raisedBy: actor.id,
      assignedTo: dto.targetUserId,
      level: 2,
      notes: dto.notes,
      status: 'Pending',
      parentEscalationId: parentEscalation._id
    });

    // Update parent status
    parentEscalation.status = 'In Review';
    await parentEscalation.save();

    await auditLogService.log({
      actor: { id: actor.id, name: actor.name || 'Unknown', role: actor.role },
      action: 'ESCALATION_ESCALATED',
      target: { id: level2Escalation._id as any, type: 'escalations', name: `Level 2 Escalation for ${(parentEscalation.candidateId as any).name}` },
      metadata: { after: dto }
    });

    return this.mapToDTO(level2Escalation);
  }

  /**
   * Resolve an escalation
   */
  async resolve(actor: any, escalationId: string, dto: IEscalationResolveDTO): Promise<IEscalationResponseDTO> {
    const escalation = await Escalation.findById(escalationId).populate('candidateId');
    if (!escalation) throw new Error("Escalation not found");

    if (escalation.assignedTo.toString() !== actor.id) {
      throw new Error("Only the assigned user can resolve the escalation");
    }

    const beforeState = { status: escalation.status, comment: escalation.resolutionComment };
    escalation.status = 'Resolved';
    escalation.resolutionComment = dto.resolutionComment;
    await escalation.save();

    // If it has a parent, resolve it too
    if (escalation.parentEscalationId) {
      await Escalation.findByIdAndUpdate(escalation.parentEscalationId, {
        status: 'Resolved',
        resolutionComment: `Resolved at Level 2: ${dto.resolutionComment}`
      });
    }

    await auditLogService.log({
      actor: { id: actor.id, name: actor.name || 'Unknown', role: actor.role },
      action: 'ESCALATION_RESOLVED',
      target: { id: escalation._id as any, type: 'escalations', name: `Resolution for ${(escalation.candidateId as any).name}` },
      metadata: { before: beforeState, after: { status: 'Resolved', comment: dto.resolutionComment } }
    });

    return this.mapToDTO(escalation);
  }

  /**
   * Cancel an escalation (Pending only)
   */
  async cancel(actor: any, escalationId: string): Promise<IEscalationResponseDTO> {
    const escalation = await Escalation.findById(escalationId).populate('candidateId');
    if (!escalation) throw new Error("Escalation not found");

    if (escalation.raisedBy.toString() !== actor.id) {
      throw new Error("Only the user who raised the escalation can cancel it");
    }

    if (escalation.status !== 'Pending') {
      throw new Error("Only pending escalations can be cancelled");
    }

    const beforeStatus = escalation.status;
    escalation.status = 'Cancelled';
    await escalation.save();

    await auditLogService.log({
      actor: { id: actor.id, name: actor.name || 'Unknown', role: actor.role },
      action: 'ESCALATION_CANCELLED',
      target: { id: escalation._id as any, type: 'escalations', name: `Cancellation for ${(escalation.candidateId as any).name}` },
      metadata: { before: beforeStatus, after: 'Cancelled' }
    });

    return this.mapToDTO(escalation);
  }

  /**
   * Get escalations for the current user (either raised or assigned)
   */
  async getMyEscalations(userId: string, role: string): Promise<IEscalationResponseDTO[]> {
    let query: any = {};
    if (role === 'HR') {
      query = { raisedBy: userId };
    } else {
      query = { assignedTo: userId };
    }

    const escalations = await Escalation.find(query)
      .populate('candidateId', 'name email')
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return escalations.map(e => this.mapToDTO(e));
  }

  private mapToDTO(escalation: any): IEscalationResponseDTO {
    return {
      id: escalation._id.toString(),
      candidateId: escalation.candidateId,
      raisedBy: escalation.raisedBy,
      assignedTo: escalation.assignedTo,
      status: escalation.status,
      level: escalation.level,
      notes: escalation.notes,
      resolutionComment: escalation.resolutionComment,
      createdAt: escalation.createdAt,
      updatedAt: escalation.updatedAt
    };
  }
}

export const escalationService = new EscalationService();
