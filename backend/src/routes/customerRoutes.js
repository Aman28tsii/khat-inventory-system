import express from 'express';
import customerController from '../controllers/customerController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('customer', 'read'), customerController.getAll);
router.get('/:id', requirePermission('customer', 'read'), customerController.getById);
router.post('/', requirePermission('customer', 'create'), customerController.create);
router.put('/:id', requirePermission('customer', 'update'), customerController.update);
router.delete('/:id', requirePermission('customer', 'delete'), customerController.delete);
router.put('/:id/status', requirePermission('customer', 'update'), customerController.toggleStatus);
router.get('/:id/credit-history', requirePermission('customer', 'read'), customerController.getCreditHistory);

export default router;
