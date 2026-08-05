import { Router } from 'express';
import dashboardController from '../../controllers/dashboardController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/executive', authenticate, dashboardController.getExecutive);
router.get('/recent-activities', authenticate, dashboardController.getRecentActivities);
router.get('/alerts', authenticate, dashboardController.getAlerts);

export default router;