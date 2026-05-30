import express from 'express';
import { auditLogController } from '../controller/audit-logs.controller';
import { authenticate } from '../../legacy/middleware/auhtMiddleware.js';
import { authorize } from '../../shared/middleware/authorize';

const router = express.Router();

// Admin only — full system-wide log
router.get('/', authenticate, authorize(['Admin']), auditLogController.getLogs);

// HR Admin and HR — scoped to candidates they can access
router.get('/my-scope', authenticate, authorize(['HR Admin', 'HR']), auditLogController.getScopedLogs);

export default router;
