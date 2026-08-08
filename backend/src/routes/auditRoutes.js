import express from 'express';
import auditController from '../controllers/auditController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('audit', 'read'), auditController.getAll);
router.get('/:id', requirePermission('audit', 'read'), auditController.getById);
router.get('/resources', requirePermission('audit', 'read'), auditController.getResources);
router.get('/actions', requirePermission('audit', 'read'), auditController.getActions);
router.get('/user/:userId', requirePermission('audit', 'read'), auditController.getUserActivity);
router.delete('/:id', requirePermission('audit', 'delete'), auditController.delete);
router.delete('/old', requirePermission('audit', 'delete'), auditController.deleteOld);

export default router;
