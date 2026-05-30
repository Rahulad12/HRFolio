import express from 'express';
import { escalationController } from '../controller/escalations.controller';
import { authenticate } from '../../../legacy/middleware/auhtMiddleware.js';
import { authorize } from '../../../shared/middleware/authorize';

const router = express.Router();

// Get user's escalations (HR sees raised, Admin/HRA sees assigned)
router.get('/my', authenticate, escalationController.getMyEscalations);

// Raise Level 1 (HR only)
router.post('/raise', authenticate, authorize(['HR']), escalationController.raiseLevel1);

// Escalate to Level 2 (HR Admin only)
router.post('/:id/escalate', authenticate, authorize(['HR Admin']), escalationController.escalateToLevel2);

// Resolve (HR Admin or Admin)
router.post('/:id/resolve', authenticate, authorize(['HR Admin', 'Admin']), escalationController.resolve);

// Cancel (HR only, only Pending)
router.post('/:id/cancel', authenticate, authorize(['HR']), escalationController.cancel);

export default router;
