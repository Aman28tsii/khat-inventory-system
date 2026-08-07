import { Router } from 'express';
import productController from '../../controllers/productController.js';
import batchController from '../../controllers/batchController.js';
import { authenticate } from '../../middlewares/auth.js';

const router = Router();

// Product routes
router.get('/products', authenticate, productController.getAll);
router.get('/products/:id', authenticate, productController.getById);
router.post('/products', authenticate, productController.create);
router.put('/products/:id', authenticate, productController.update);
router.delete('/products/:id', authenticate, productController.delete);
router.put('/products/:id/status', authenticate, productController.toggleStatus);

// Batch routes
router.get('/batches', authenticate, batchController.getAll);
router.get('/batches/expiring', authenticate, batchController.getExpiring);
router.get('/batches/:id', authenticate, batchController.getById);
router.post('/batches', authenticate, batchController.create);
router.put('/batches/:id', authenticate, batchController.update);
router.put('/batches/:id/quality', authenticate, batchController.qualityInspection);
router.delete('/batches/:id', authenticate, batchController.delete);

export default router;