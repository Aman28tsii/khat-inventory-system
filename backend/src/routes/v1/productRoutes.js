import { Router } from 'express';
import productController from '../../controllers/productController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, productController.getAll);
router.get('/:id', authenticate, productController.getById);
router.post('/', authenticate, productController.create);
router.put('/:id', authenticate, productController.update);
router.delete('/:id', authenticate, productController.delete);
router.put('/:id/status', authenticate, productController.toggleStatus);

export default router;