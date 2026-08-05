import { Router } from 'express';
import reportController from '../../controllers/reportController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

router.get('/inventory', authenticate, reportController.getInventoryReport);
router.get('/sales', authenticate, reportController.getSalesReport);
router.get('/profit', authenticate, reportController.getProfitReport);
router.get('/branch-comparison', authenticate, reportController.getBranchComparison);
router.get('/supplier', authenticate, reportController.getSupplierReport);
router.get('/branch', authenticate, reportController.getBranchReport);

export default router;