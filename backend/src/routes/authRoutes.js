import express from 'express';
import authController from '../controllers/authController.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public auth routes (no authentication required)
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);
router.post('/change-password', authController.changePassword);
router.get('/me', authController.getCurrentUser);

export default router;
