import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { AppError } from './errorHandler.js';

const JWT_SECRET = '3f7a8b9c2d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      roleName: user.role.name,
      branchId: user.branchId,
      permissions: user.role.permissions.map((p) => ${p.permission.resource}:),
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    next(error);
  }
};

// Simplified permission check - allows super admin everything
export const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      // Super admin can do everything
      if (req.user.roleName === 'SUPER_ADMIN') {
        return next();
      }

      const hasPermission = req.user.permissions.some(
        (p) => p === ${resource}: || p === ${resource}:*
      );

      if (!hasPermission) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireRole = (roleNames) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!roleNames.includes(req.user.roleName)) {
      throw new AppError('Insufficient role permissions', 403);
    }
    next();
  };
};
