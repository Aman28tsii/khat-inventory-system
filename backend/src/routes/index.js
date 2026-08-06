import { Router } from 'express';
import authRoutes from './v1/authRoutes.js';

const router = Router();

// Health check at API level
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;