import express from 'express';
import { escalationController } from '../controller/escalations.controller';
import { authenticate } from '../../../legacy/middleware/auhtMiddleware.js';
import { hasPermission } from '../../../shared/middleware/hasPermission';

const router = express.Router();

// Get user's escalations (HR sees raised, Admin/HRA sees assigned)
router.get('/my', authenticate, escalationController.getMyEscalations);

router.post('/raise', authenticate, hasPermission('escalations:create'), escalationController.raiseLevel1);
router.post('/:id/escalate', authenticate, hasPermission('escalations:update'), escalationController.escalateToLevel2);
router.post('/:id/resolve', authenticate, hasPermission('escalations:update'), escalationController.resolve);
router.post('/:id/cancel', authenticate, hasPermission('escalations:create'), escalationController.cancel);

export default router;
