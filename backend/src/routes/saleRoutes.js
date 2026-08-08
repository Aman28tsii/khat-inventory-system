import express from 'express';
import saleController from '../controllers/saleController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('sale', 'read'), saleController.getAll);
router.get('/:id', requirePermission('sale', 'read'), saleController.getById);
router.post('/', requirePermission('sale', 'create'), saleController.create);
router.put('/:id', requirePermission('sale', 'update'), saleController.update);
router.post('/:id/payment', requirePermission('sale', 'update'), saleController.processPayment);
router.post('/:id/return', requirePermission('sale', 'update'), saleController.returnSale);
router.get('/:id/payments', requirePermission('sale', 'read'), saleController.getPayments);
router.get('/available-batches', requirePermission('sale', 'read'), saleController.getAvailableBatches);
router.delete('/:id', requirePermission('sale', 'delete'), saleController.delete);

export default router;
