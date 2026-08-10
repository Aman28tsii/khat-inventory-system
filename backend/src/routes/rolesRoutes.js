import express from 'express';
import roleController from '../controllers/roleController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('role', 'read'), roleController.getAll);
router.get('/:id', requirePermission('role', 'read'), roleController.getById);
router.post('/', requirePermission('role', 'create'), roleController.create);
router.put('/:id', requirePermission('role', 'update'), roleController.update);
router.delete('/:id', requirePermission('role', 'delete'), roleController.delete);
router.post('/:id/permissions', requirePermission('role', 'update'), roleController.assignPermissions);
router.delete('/:id/permissions/:permissionId', requirePermission('role', 'update'), roleController.removePermission);

export default router;
