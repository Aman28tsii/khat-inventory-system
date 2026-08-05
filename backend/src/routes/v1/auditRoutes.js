import { Router } from 'express';
import auditController from '../../controllers/auditController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, auditController.getAll);
router.get('/resources', authenticate, auditController.getResources);
router.get('/actions', authenticate, auditController.getActions);
router.get('/:id', authenticate, auditController.getById);
router.get('/user/:userId/activity', authenticate, auditController.getUserActivity);
router.delete('/:id', authenticate, auditController.delete);
router.delete('/old/cleanup', authenticate, auditController.deleteOld);

export default router;