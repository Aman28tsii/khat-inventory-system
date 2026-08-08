import express from 'express';
import branchController from '../controllers/branchController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', branchController.getAll);
router.get('/:id', branchController.getById);
router.post('/', branchController.create);
router.put('/:id', branchController.update);
router.delete('/:id', branchController.delete);
router.put('/:id/status', branchController.toggleStatus);

export default router;
