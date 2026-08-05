import { Router } from 'express';
import notificationController from '../../controllers/notificationController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, notificationController.getAll);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.get('/preferences', authenticate, notificationController.getPreferences);
router.put('/:id/read', authenticate, notificationController.markAsRead);
router.put('/read-all', authenticate, notificationController.markAllAsRead);
router.put('/:id/archive', authenticate, notificationController.archive);
router.put('/preferences', authenticate, notificationController.updatePreferences);
router.delete('/:id', authenticate, notificationController.delete);
router.delete('/', authenticate, notificationController.deleteAll);

export default router;