import express from 'express';
import { auditLogController } from '../controller/audit-logs.controller';
import { authenticate } from '../../../legacy/middleware/auhtMiddleware.js';
import { hasPermission } from '../../../shared/middleware/hasPermission';

const router = express.Router();

router.get('/', authenticate, hasPermission('audit-logs:read'), auditLogController.getLogs);
router.get('/my-scope', authenticate, hasPermission('audit-logs:read'), auditLogController.getScopedLogs);

export default router;
