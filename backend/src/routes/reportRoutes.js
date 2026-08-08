import express from 'express';
import reportController from '../controllers/reportController.js';
import { authenticate, requirePermission } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/inventory', requirePermission('report', 'read'), reportController.getInventoryReport);
router.get('/sales', requirePermission('report', 'read'), reportController.getSalesReport);
router.get('/profit', requirePermission('report', 'read'), reportController.getProfitReport);
router.get('/branch-comparison', requirePermission('report', 'read'), reportController.getBranchComparison);
router.get('/supplier', requirePermission('report', 'read'), reportController.getSupplierReport);
router.get('/branch', requirePermission('report', 'read'), reportController.getBranchReport);

export default router;
