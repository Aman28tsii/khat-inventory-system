import express from 'express';
import purchaseController from '../controllers/purchaseController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('purchase', 'read'), purchaseController.getAll);
router.get('/:id', requirePermission('purchase', 'read'), purchaseController.getById);
router.post('/', requirePermission('purchase', 'create'), purchaseController.create);
router.put('/:id', requirePermission('purchase', 'update'), purchaseController.update);
router.post('/:id/receive', requirePermission('purchase', 'update'), purchaseController.receive);
router.post('/:id/approve', requirePermission('purchase', 'update'), purchaseController.approve);
router.post('/:id/reject', requirePermission('purchase', 'update'), purchaseController.reject);
router.delete('/:id', requirePermission('purchase', 'delete'), purchaseController.delete);
router.get('/:id/items', requirePermission('purchase', 'read'), purchaseController.getItems);
router.post('/:id/items', requirePermission('purchase', 'update'), purchaseController.addItem);
router.delete('/:id/items/:itemId', requirePermission('purchase', 'update'), purchaseController.removeItem);

export default router;
