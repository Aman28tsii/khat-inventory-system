import express from 'express';
import settingsController from '../controllers/settingsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', settingsController.getAll);
router.get('/:key', settingsController.getByKey);
router.post('/', settingsController.create);
router.put('/:key', settingsController.update);
router.delete('/:key', settingsController.delete);

export default router;
