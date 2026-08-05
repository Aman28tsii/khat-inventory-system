import { Router } from 'express';
import batchController from '../../controllers/batchController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, batchController.getAll);
router.get('/expiring', authenticate, batchController.getExpiring);
router.get('/:id', authenticate, batchController.getById);
router.post('/', authenticate, batchController.create);
router.put('/:id', authenticate, batchController.update);
router.put('/:id/quality', authenticate, batchController.qualityInspection);
router.delete('/:id', authenticate, batchController.delete);

export default router;