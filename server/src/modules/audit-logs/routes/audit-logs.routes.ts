import express from 'express';
import { auditLogController } from '../controller/audit-logs.controller';
import { authenticate } from '../../legacy/middleware/auhtMiddleware.js';
import { authorize } from '../../shared/middleware/authorize';

const router = express.Router();

// Only Admins can view the full audit trail
router.get('/', authenticate, authorize(['Admin']), auditLogController.getLogs);

export default router;
