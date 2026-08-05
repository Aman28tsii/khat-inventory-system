import { Router } from 'express';
import transferController from '../../controllers/transferController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, transferController.getAll);
router.get('/:id', authenticate, transferController.getById);
router.get('/:id/items', authenticate, transferController.getItems);
router.get('/available-batches', authenticate, transferController.getAvailableBatches);
router.post('/', authenticate, transferController.create);
router.post('/:id/approve', authenticate, transferController.approve);
router.post('/:id/reject', authenticate, transferController.reject);
router.post('/:id/receive', authenticate, transferController.receive);
router.put('/:id', authenticate, transferController.update);
router.delete('/:id', authenticate, transferController.delete);

export default router;