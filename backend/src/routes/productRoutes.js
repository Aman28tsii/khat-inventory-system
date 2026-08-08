import express from 'express';
import productController from '../controllers/productController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('product', 'read'), productController.getAll);
router.get('/:id', requirePermission('product', 'read'), productController.getById);
router.post('/', requirePermission('product', 'create'), productController.create);
router.put('/:id', requirePermission('product', 'update'), productController.update);
router.delete('/:id', requirePermission('product', 'delete'), productController.delete);
router.put('/:id/status', requirePermission('product', 'update'), productController.toggleStatus);

export default router;
