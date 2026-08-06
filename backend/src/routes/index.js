import { Router } from 'express';
import authRoutes from './v1/authRoutes.js';
import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// TEMPORARY SEED ROUTE - Remove after use
router.get('/seed', async (req, res) => {
  try {
    // Check if admin exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@khattrading.com' }
    });

    if (adminExists) {
      return res.json({ message: 'Admin already exists' });
    }

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    // Get super admin role
    const role = await prisma.role.findFirst({
      where: { name: 'SUPER_ADMIN' }
    });

    if (!role) {
      return res.status(400).json({ error: 'Role not found. Run seed first.' });
    }

    const admin = await prisma.user.create({
      data: {
        email: 'admin@khattrading.com',
        passwordHash: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        employeeId: 'EMP001',
        roleId: role.id,
        isActive: true,
        isVerified: true,
      }
    });

    res.json({ 
      message: 'Admin created successfully',
      email: 'admin@khattrading.com',
      password: 'Admin@123'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
router.use('/auth', authRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;