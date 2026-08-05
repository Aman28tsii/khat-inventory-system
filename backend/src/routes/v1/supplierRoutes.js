import { Router } from 'express';
import supplierController from '../../controllers/supplierController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, supplierController.getAll);
router.get('/:id', authenticate, supplierController.getById);
router.post('/', authenticate, supplierController.create);
router.put('/:id', authenticate, supplierController.update);
router.delete('/:id', authenticate, supplierController.delete);
router.put('/:id/status', authenticate, supplierController.toggleStatus);

export default router;