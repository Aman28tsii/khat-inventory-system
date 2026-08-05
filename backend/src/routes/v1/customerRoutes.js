import { Router } from 'express';
import customerController from '../../controllers/customerController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, customerController.getAll);
router.get('/:id', authenticate, customerController.getById);
router.get('/:id/credit-history', authenticate, customerController.getCreditHistory);
router.post('/', authenticate, customerController.create);
router.put('/:id', authenticate, customerController.update);
router.delete('/:id', authenticate, customerController.delete);
router.put('/:id/status', authenticate, customerController.toggleStatus);

export default router;