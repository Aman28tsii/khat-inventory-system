import express from 'express';
import dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/executive', dashboardController.getExecutive);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/alerts', dashboardController.getAlerts);

export default router;
