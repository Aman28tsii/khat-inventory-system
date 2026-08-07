import { Router } from 'express';
import roleController from '../../controllers/roleController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, roleController.getAll);
router.get('/:id', authenticate, roleController.getById);
router.post('/', authenticate, roleController.create);
router.put('/:id', authenticate, roleController.update);
router.delete('/:id', authenticate, roleController.delete);
router.post('/:id/permissions', authenticate, roleController.assignPermissions);
router.delete('/:id/permissions/:permissionId', authenticate, roleController.removePermission);

export default router;