import express from 'express';
import inventoryController from '../controllers/inventoryController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', inventoryController.getAll);
router.get('/movements', inventoryController.getStockMovements);
router.get('/low-stock', inventoryController.getLowStock);
router.get('/expiring', inventoryController.getExpiring);
router.get('/batch/:batchId', inventoryController.getByBatch);
router.get('/branch/:branchId', inventoryController.getByBranch);

export default router;
