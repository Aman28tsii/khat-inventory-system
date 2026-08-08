import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('user', 'read'), userController.getAll);
router.get('/:id', requirePermission('user', 'read'), userController.getById);
router.post('/', requirePermission('user', 'create'), userController.create);
router.put('/:id', requirePermission('user', 'update'), userController.update);
router.delete('/:id', requirePermission('user', 'delete'), userController.delete);
router.put('/:id/status', requirePermission('user', 'update'), userController.toggleStatus);
router.put('/:id/role', requirePermission('user', 'update'), userController.updateRole);
router.post('/:id/reset-password', requirePermission('user', 'update'), userController.resetPassword);

export default router;
