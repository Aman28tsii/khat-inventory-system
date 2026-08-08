import express from 'express';
import supplierController from '../controllers/supplierController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('supplier', 'read'), supplierController.getAll);
router.get('/:id', requirePermission('supplier', 'read'), supplierController.getById);
router.post('/', requirePermission('supplier', 'create'), supplierController.create);
router.put('/:id', requirePermission('supplier', 'update'), supplierController.update);
router.delete('/:id', requirePermission('supplier', 'delete'), supplierController.delete);
router.put('/:id/status', requirePermission('supplier', 'update'), supplierController.toggleStatus);

export default router;
