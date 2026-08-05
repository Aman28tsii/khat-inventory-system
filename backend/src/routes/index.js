import { Router } from 'express';
import authRoutes from './v1/authRoutes.js';
import userRoutes from './v1/userRoutes.js';
import productRoutes from './v1/productRoutes.js';
import supplierRoutes from './v1/supplierRoutes.js';
import batchRoutes from './v1/batchRoutes.js';
import customerRoutes from './v1/customerRoutes.js';
import purchaseRoutes from './v1/purchaseRoutes.js';
import saleRoutes from './v1/saleRoutes.js';
import transferRoutes from './v1/transferRoutes.js';
import reportRoutes from './v1/reportRoutes.js';
import notificationRoutes from './v1/notificationRoutes.js';
import auditRoutes from './v1/auditRoutes.js';
import dashboardRoutes from './v1/dashboardRoutes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Product routes
router.use('/products', productRoutes);

// Supplier routes
router.use('/suppliers', supplierRoutes);

// Batch routes
router.use('/batches', batchRoutes);

// Customer routes
router.use('/customers', customerRoutes);

// Purchase routes
router.use('/purchases', purchaseRoutes);

// Sale routes
router.use('/sales', saleRoutes);

// Transfer routes
router.use('/transfers', transferRoutes);

// Report routes
router.use('/reports', reportRoutes);

// Notification routes
router.use('/notifications', notificationRoutes);

// Audit routes
router.use('/audit-logs', auditRoutes);

// Dashboard routes
router.use('/dashboard', dashboardRoutes);

export default router;