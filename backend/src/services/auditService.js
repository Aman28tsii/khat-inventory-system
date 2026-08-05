import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class AuditService {
  async getAll(filters = {}) {
    const { 
      search, 
      resourceType, 
      action, 
      userId, 
      startDate, 
      endDate,
      page = 1, 
      limit = 20 
    } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { resourceType: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (resourceType) {
      where.resourceType = resourceType;
    }

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data: logs, total };
  }

  async getById(id) {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!log) {
      throw new AppError('Audit log not found', 404);
    }

    return log;
  }

  async create(data) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        changes: data.changes || {},
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async getResources() {
    const resources = await prisma.auditLog.groupBy({
      by: ['resourceType'],
      orderBy: {
        resourceType: 'asc',
      },
    });

    return resources.map((r) => r.resourceType);
  }

  async getActions() {
    const actions = await prisma.auditLog.groupBy({
      by: ['action'],
      orderBy: {
        action: 'asc',
      },
    });

    return actions.map((a) => a.action);
  }

  async getUserActivity(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Group by action type
    const activitySummary = {
      total: logs.length,
      byAction: {},
      byResource: {},
      lastLogin: null,
    };

    for (const log of logs) {
      // Count by action
      if (!activitySummary.byAction[log.action]) {
        activitySummary.byAction[log.action] = 0;
      }
      activitySummary.byAction[log.action]++;

      // Count by resource
      if (!activitySummary.byResource[log.resourceType]) {
        activitySummary.byResource[log.resourceType] = 0;
      }
      activitySummary.byResource[log.resourceType]++;

      // Track last login
      if (log.action === 'LOGIN' && !activitySummary.lastLogin) {
        activitySummary.lastLogin = log.createdAt;
      }
    }

    return {
      summary: activitySummary,
      recentActivity: logs.slice(0, 20),
    };
  }

  async delete(id) {
    const log = await prisma.auditLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new AppError('Audit log not found', 404);
    }

    await prisma.auditLog.delete({ where: { id } });
    return { success: true };
  }

  async deleteOld(days = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return { deleted: result.count };
  }

  // Middleware function to log actions
  logAction(req, action, resourceType, resourceId, changes = {}) {
    const userId = req.user?.id;
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.create({
      userId,
      action,
      resourceType,
      resourceId,
      changes,
      ipAddress,
      userAgent,
    }).catch((error) => {
      console.error('Failed to log audit:', error);
    });
  }
}

export default new AuditService();