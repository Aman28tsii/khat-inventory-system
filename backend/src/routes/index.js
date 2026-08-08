import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import branchRoutes from './branchRoutes.js';
import productRoutes from './productRoutes.js';
import batchRoutes from './batchRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import customerRoutes from './customerRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import saleRoutes from './saleRoutes.js';
import transferRoutes from './transferRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import reportRoutes from './reportRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import auditRoutes from './auditRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Protected routes (authentication required)
router.use('/users', authenticate, userRoutes);
router.use('/branches', authenticate, branchRoutes);
router.use('/products', authenticate, productRoutes);
router.use('/batches', authenticate, batchRoutes);
router.use('/inventory', authenticate, inventoryRoutes);
router.use('/customers', authenticate, customerRoutes);
router.use('/suppliers', authenticate, supplierRoutes);
router.use('/purchases', authenticate, purchaseRoutes);
router.use('/sales', authenticate, saleRoutes);
router.use('/transfers', authenticate, transferRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/reports', authenticate, reportRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/audit-logs', authenticate, auditRoutes);
router.use('/notifications', authenticate, notificationRoutes);

export default router;
