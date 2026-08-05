import { Router } from 'express';
import saleController from '../../controllers/saleController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, saleController.getAll);
router.get('/:id', authenticate, saleController.getById);
router.get('/:id/payments', authenticate, saleController.getPayments);
router.get('/available-batches', authenticate, saleController.getAvailableBatches);
router.post('/', authenticate, saleController.create);
router.post('/:id/payment', authenticate, saleController.processPayment);
router.post('/:id/return', authenticate, saleController.returnSale);
router.put('/:id', authenticate, saleController.update);
router.delete('/:id', authenticate, saleController.delete);

export default router;