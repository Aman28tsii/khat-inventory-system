import { Router } from 'express';
import purchaseController from '../../controllers/purchaseController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, purchaseController.getAll);
router.get('/:id', authenticate, purchaseController.getById);
router.get('/:id/items', authenticate, purchaseController.getItems);
router.post('/', authenticate, purchaseController.create);
router.post('/:id/receive', authenticate, purchaseController.receive);
router.post('/:id/approve', authenticate, purchaseController.approve);
router.post('/:id/reject', authenticate, purchaseController.reject);
router.post('/:id/items', authenticate, purchaseController.addItem);
router.put('/:id', authenticate, purchaseController.update);
router.delete('/:id', authenticate, purchaseController.delete);
router.delete('/items/:itemId', authenticate, purchaseController.removeItem);

export default router;