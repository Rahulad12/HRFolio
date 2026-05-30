import mongoose from 'mongoose';
import { AuditLog } from '../model/AuditLog';
import { IAuditLogDTO, IAuditLogQuery, IScopedAuditLogQuery } from '../types/audit-logs.types';

export class AuditLogService {
  /**
   * Create a new audit log entry (Immutable)
   */
  async log(data: Omit<IAuditLogDTO, 'timestamp'>): Promise<void> {
    try {
      await AuditLog.create({
        ...data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // We don't throw here to prevent blocking the main business action
    }
  }

  /**
   * Fetch logs with filtering and pagination
   */
  async getLogs(query: IAuditLogQuery): Promise<{ logs: any[]; total: number }> {
    const mongoQuery: any = {};

    if (query.actorId) mongoQuery['actor.id'] = query.actorId;
    if (query.targetId) mongoQuery['target.id'] = query.targetId;
    if (query.action) mongoQuery.action = query.action;

    if (query.startDate || query.endDate) {
      mongoQuery.timestamp = {};
      if (query.startDate) mongoQuery.timestamp.$gte = new Date(query.startDate);
      if (query.endDate) mongoQuery.timestamp.$lte = new Date(query.endDate);
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(mongoQuery)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(mongoQuery)
    ]);

    return { logs, total };
  }

  /**
   * Returns audit logs scoped by the caller's role:
   *   HR Admin → all candidate + escalation logs
   *   HR       → logs where target.id is one of their own candidates
   */
  async getScopedLogs(
    userId: string,
    role: string,
    query: IScopedAuditLogQuery
  ): Promise<{ logs: any[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    let mongoQuery: any = {};

    if (role === 'HR Admin') {
      mongoQuery = { 'target.type': { $in: ['candidates', 'escalations'] } };
    } else if (role === 'HR') {
      const Candidate = mongoose.model('candidates');
      const ownCandidates = await Candidate.find(
        { createdBy: new mongoose.Types.ObjectId(userId) },
        '_id'
      ).lean();
      const ids = ownCandidates.map((c: any) => c._id);
      mongoQuery = { 'target.id': { $in: ids }, 'target.type': 'candidates' };
    } else {
      return { logs: [], total: 0 };
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(mongoQuery).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(mongoQuery),
    ]);

    return { logs, total };
  }
}

export const auditLogService = new AuditLogService();
