import express from 'express';
import batchController from '../controllers/batchController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('inventory', 'read'), batchController.getAll);
router.get('/:id', requirePermission('inventory', 'read'), batchController.getById);
router.post('/', requirePermission('inventory', 'create'), batchController.create);
router.put('/:id', requirePermission('inventory', 'update'), batchController.update);
router.post('/:id/inspect', requirePermission('inventory', 'update'), batchController.qualityInspection);
router.get('/expiring', requirePermission('inventory', 'read'), batchController.getExpiring);
router.delete('/:id', requirePermission('inventory', 'delete'), batchController.delete);

export default router;
