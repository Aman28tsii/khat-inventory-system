import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import { emitNotification, emitAlert } from '../socket/index.js';

class NotificationService {
  // ============================================
  // CRUD OPERATIONS
  // ============================================

  async getAll(filters = {}) {
    const { userId, isRead, type, page = 1, limit = 10 } = filters;

    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (isRead !== undefined) {
      where.isRead = isRead === 'true' || isRead === true;
    }

    if (type) {
      where.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.notification.count({ where }),
    ]);

    return { data: notifications, total };
  }

  async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
        isArchived: false,
      },
    });

    return count;
  }

  async create(data) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        priority: data.priority || 'NORMAL',
        actionUrl: data.actionUrl,
      },
    });

    // Emit via Socket.IO
    emitNotification(data.userId, notification);

    return notification;
  }

  async createBulk(dataArray) {
    const notifications = await prisma.notification.createMany({
      data: dataArray.map((data) => ({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        priority: data.priority || 'NORMAL',
        actionUrl: data.actionUrl,
      })),
    });

    // Emit to each user
    for (const data of dataArray) {
      emitNotification(data.userId, {
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        priority: data.priority || 'NORMAL',
        actionUrl: data.actionUrl,
      });
    }

    return notifications;
  }

  async markAsRead(id) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return updated;
  }

  async markAllAsRead(userId) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  async archive(id) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    return prisma.notification.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async delete(id) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError('Notification not found', 404);
    }

    await prisma.notification.delete({ where: { id } });
    return { success: true };
  }

  async deleteAll(userId) {
    await prisma.notification.deleteMany({
      where: { userId },
    });

    return { success: true };
  }

  async getPreferences(userId) {
    // For now, return default preferences
    // In production, this would be stored in user preferences
    return {
      email: true,
      push: true,
      inApp: true,
      types: {
        inventory: true,
        sales: true,
        purchases: true,
        transfers: true,
        users: true,
        system: true,
      },
    };
  }

  async updatePreferences(userId, data) {
    // In production, update user preferences
    // For now, just return the data
    return data;
  }

  // ============================================
  // TRIGGER FUNCTIONS - AUTO NOTIFICATIONS
  // ============================================

  // Trigger when inventory is low
  async triggerLowStockAlert(batchId) {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        product: true,
        inventory: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!batch) return;

    const inventory = batch.inventory[0];
    if (!inventory) return;

    const minStock = batch.product.minStockQuantity || 10;
    if (inventory.availableQuantity < minStock) {
      const users = await prisma.user.findMany({
        where: {
          role: {
            name: { in: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER'] },
          },
          isActive: true,
        },
        select: { id: true },
      });

      const notificationData = {
        title: '⚠️ Low Stock Alert',
        message: `Product "${batch.product.name}" (Batch: ${batch.batchNumber}) is below reorder level. Available: ${inventory.availableQuantity} at ${inventory.branch.name}`,
        type: 'inventory',
        priority: 'HIGH',
        actionUrl: `/inventory/batches/${batch.id}`,
      };

      // Emit alert to dashboard
      emitAlert({
        type: 'warning',
        title: notificationData.title,
        message: notificationData.message,
        action: 'View Batch',
        actionUrl: notificationData.actionUrl,
      });

      for (const user of users) {
        await this.create({
          userId: user.id,
          ...notificationData,
        });
      }
    }
  }

  // Trigger when batch is expiring
  async triggerExpiryAlert(batchId) {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId },
      include: {
        product: true,
        inventory: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!batch || !batch.expiryDate) return;

    const daysUntilExpiry = Math.ceil((new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 30 && daysUntilExpiry > 0) {
      const users = await prisma.user.findMany({
        where: {
          role: {
            name: { in: ['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER'] },
          },
          isActive: true,
        },
        select: { id: true },
      });

      const inventory = batch.inventory[0];
      const notificationData = {
        title: '📅 Batch Expiring Soon',
        message: `Batch "${batch.batchNumber}" for product "${batch.product.name}" will expire in ${daysUntilExpiry} days. Remaining: ${batch.remainingQuantity}${inventory ? ` at ${inventory.branch.name}` : ''}`,
        type: 'inventory',
        priority: 'HIGH',
        actionUrl: `/inventory/batches/${batch.id}`,
      };

      // Emit alert to dashboard
      emitAlert({
        type: 'warning',
        title: notificationData.title,
        message: notificationData.message,
        action: 'View Batch',
        actionUrl: notificationData.actionUrl,
      });

      for (const user of users) {
        await this.create({
          userId: user.id,
          ...notificationData,
        });
      }
    }
  }

  // Trigger when new sale is created
  async triggerNewSaleAlert(saleId) {
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        customer: true,
        branch: true,
        items: true,
      },
    });

    if (!sale) return;

    const users = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
        },
        isActive: true,
      },
      select: { id: true },
    });

    const notificationData = {
      title: '💰 New Sale Completed',
      message: `Sale ${sale.saleNumber} completed for $${sale.totalAmount.toFixed(2)}${sale.customer ? ` by ${sale.customer.name}` : ''} at ${sale.branch.name}`,
      type: 'sales',
      priority: 'NORMAL',
      actionUrl: `/sales/${sale.id}`,
    };

    // Emit alert to dashboard
    emitAlert({
      type: 'success',
      title: notificationData.title,
      message: notificationData.message,
      action: 'View Sale',
      actionUrl: notificationData.actionUrl,
    });

    for (const user of users) {
      await this.create({
        userId: user.id,
        ...notificationData,
      });
    }
  }

  // Trigger when new purchase is created
  async triggerNewPurchaseAlert(purchaseId) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        supplier: true,
        branch: true,
        items: true,
      },
    });

    if (!purchase) return;

    const users = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
        },
        isActive: true,
      },
      select: { id: true },
    });

    const notificationData = {
      title: '📦 New Purchase Order',
      message: `Purchase ${purchase.purchaseNumber} created for $${purchase.totalAmount.toFixed(2)} from ${purchase.supplier.name} at ${purchase.branch.name}`,
      type: 'purchases',
      priority: 'NORMAL',
      actionUrl: `/purchases/${purchase.id}`,
    };

    // Emit alert to dashboard
    emitAlert({
      type: 'info',
      title: notificationData.title,
      message: notificationData.message,
      action: 'View Purchase',
      actionUrl: notificationData.actionUrl,
    });

    for (const user of users) {
      await this.create({
        userId: user.id,
        ...notificationData,
      });
    }
  }

  // Trigger when purchase is received
  async triggerPurchaseReceivedAlert(purchaseId) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        supplier: true,
        branch: true,
        items: true,
      },
    });

    if (!purchase) return;

    const users = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'INVENTORY_MANAGER'] },
        },
        isActive: true,
      },
      select: { id: true },
    });

    const notificationData = {
      title: '✅ Purchase Received',
      message: `Purchase ${purchase.purchaseNumber} from ${purchase.supplier.name} has been received at ${purchase.branch.name}`,
      type: 'purchases',
      priority: 'NORMAL',
      actionUrl: `/purchases/${purchase.id}`,
    };

    // Emit alert to dashboard
    emitAlert({
      type: 'success',
      title: notificationData.title,
      message: notificationData.message,
      action: 'View Purchase',
      actionUrl: notificationData.actionUrl,
    });

    for (const user of users) {
      await this.create({
        userId: user.id,
        ...notificationData,
      });
    }
  }

  // Trigger when new transfer is created
  async triggerNewTransferAlert(transferId) {
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        fromBranch: true,
        toBranch: true,
        items: true,
      },
    });

    if (!transfer) return;

    const users = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
        },
        isActive: true,
      },
      select: { id: true },
    });

    const notificationData = {
      title: '🔄 New Transfer Created',
      message: `Transfer ${transfer.transferNumber} from ${transfer.fromBranch.name} to ${transfer.toBranch.name} with ${transfer.items.length} items`,
      type: 'transfers',
      priority: 'NORMAL',
      actionUrl: `/transfers/${transfer.id}`,
    };

    // Emit alert to dashboard
    emitAlert({
      type: 'info',
      title: notificationData.title,
      message: notificationData.message,
      action: 'View Transfer',
      actionUrl: notificationData.actionUrl,
    });

    for (const user of users) {
      await this.create({
        userId: user.id,
        ...notificationData,
      });
    }
  }

  // Trigger when transfer is received
  async triggerTransferReceivedAlert(transferId) {
    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        fromBranch: true,
        toBranch: true,
        items: true,
      },
    });

    if (!transfer) return;

    const users = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'INVENTORY_MANAGER'] },
        },
        isActive: true,
      },
      select: { id: true },
    });

    const notificationData = {
      title: '✅ Transfer Received',
      message: `Transfer ${transfer.transferNumber} has been received at ${transfer.toBranch.name} from ${transfer.fromBranch.name}`,
      type: 'transfers',
      priority: 'NORMAL',
      actionUrl: `/transfers/${transfer.id}`,
    };

    // Emit alert to dashboard
    emitAlert({
      type: 'success',
      title: notificationData.title,
      message: notificationData.message,
      action: 'View Transfer',
      actionUrl: notificationData.actionUrl,
    });

    for (const user of users) {
      await this.create({
        userId: user.id,
        ...notificationData,
      });
    }
  }

  // Trigger when new user is created
  async triggerNewUserAlert(userId) {
    const newUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        branch: true,
      },
    });

    if (!newUser) return;

    const admins = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ['SUPER_ADMIN', 'ADMIN'] },
        },
        isActive: true,
        id: { not: userId },
      },
      select: { id: true },
    });

    const notificationData = {
      title: '👤 New User Created',
      message: `User "${newUser.firstName} ${newUser.lastName}" (${newUser.email}) has been created with role "${newUser.role.name}"${newUser.branch ? ` at ${newUser.branch.name}` : ''}`,
      type: 'users',
      priority: 'NORMAL',
      actionUrl: `/users/${newUser.id}`,
    };

    for (const admin of admins) {
      await this.create({
        userId: admin.id,
        ...notificationData,
      });
    }
  }

  // ============================================
  // SCHEDULED JOBS (called by cron jobs)
  // ============================================

  // Check all batches for low stock and expiry
  async runScheduledChecks() {
    console.log('🔄 Running scheduled notification checks...');

    // Check low stock
    const lowStockBatches = await prisma.batch.findMany({
      where: {
        status: { in: ['AVAILABLE', 'PARTIAL'] },
        remainingQuantity: {
          lt: 10,
        },
      },
      include: {
        product: true,
        inventory: {
          include: {
            branch: true,
          },
        },
      },
    });

    for (const batch of lowStockBatches) {
      await this.triggerLowStockAlert(batch.id);
    }

    // Check expiring batches
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringBatches = await prisma.batch.findMany({
      where: {
        status: { in: ['AVAILABLE', 'PARTIAL'] },
        expiryDate: {
          lte: thirtyDaysFromNow,
          gt: new Date(),
        },
      },
      include: {
        product: true,
        inventory: {
          include: {
            branch: true,
          },
        },
      },
    });

    for (const batch of expiringBatches) {
      await this.triggerExpiryAlert(batch.id);
    }

    console.log(`✅ Notification checks completed. Low stock: ${lowStockBatches.length}, Expiring: ${expiringBatches.length}`);
  }
}

export default new NotificationService();