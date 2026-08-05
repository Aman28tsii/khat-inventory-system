import { Router } from 'express';
import userController from '../../controllers/userController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, userController.getAll);
router.get('/:id', authenticate, userController.getById);
router.post('/', authenticate, userController.create);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.delete);
router.put('/:id/status', authenticate, userController.toggleStatus);
router.put('/:id/role', authenticate, userController.updateRole);
router.post('/:id/reset-password', authenticate, userController.resetPassword);

export default router;