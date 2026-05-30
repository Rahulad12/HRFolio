import { Request, Response } from 'express';
import { escalationService } from '../services/escalations.service';
import { IEscalationRequestDTO, IEscalationResolveDTO } from '../types/escalations.types';

export class EscalationController {
  async raiseLevel1(req: Request, res: Response): Promise<void> {
    try {
      const dto: IEscalationRequestDTO = req.body;
      const result = await escalationService.raiseLevel1((req as any).user, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async escalateToLevel2(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: IEscalationRequestDTO = req.body;
      const result = await escalationService.escalateToLevel2((req as any).user, id, dto);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async resolve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const dto: IEscalationResolveDTO = req.body;
      const result = await escalationService.resolve((req as any).user, id, dto);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await escalationService.cancel((req as any).user, id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMyEscalations(req: Request, res: Response): Promise<void> {
    try {
      const { id, role } = (req as any).user;
      const result = await escalationService.getMyEscalations(id, role);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const escalationController = new EscalationController();
