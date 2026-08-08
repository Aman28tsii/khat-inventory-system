import express from 'express';
import transferController from '../controllers/transferController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('transfer', 'read'), transferController.getAll);
router.get('/:id', requirePermission('transfer', 'read'), transferController.getById);
router.post('/', requirePermission('transfer', 'create'), transferController.create);
router.put('/:id', requirePermission('transfer', 'update'), transferController.update);
router.post('/:id/approve', requirePermission('transfer', 'update'), transferController.approve);
router.post('/:id/reject', requirePermission('transfer', 'update'), transferController.reject);
router.post('/:id/receive', requirePermission('transfer', 'update'), transferController.receive);
router.get('/:id/items', requirePermission('transfer', 'read'), transferController.getItems);
router.get('/available-batches', requirePermission('transfer', 'read'), transferController.getAvailableBatches);
router.delete('/:id', requirePermission('transfer', 'delete'), transferController.delete);

export default router;
