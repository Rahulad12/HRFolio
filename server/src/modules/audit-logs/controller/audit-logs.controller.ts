import { Request, Response } from 'express';
import { auditLogService } from '../services/audit-logs.service';
import { IAuditLogQuery } from '../types/audit-logs.types';

export class AuditLogController {
  async getLogs(req: Request, res: Response): Promise<void> {
    try {
      const query: IAuditLogQuery = {
        actorId: req.query.actorId as string,
        targetId: req.query.targetId as string,
        action: req.query.action as any,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50
      };

      const result = await auditLogService.getLogs(query);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const auditLogController = new AuditLogController();
