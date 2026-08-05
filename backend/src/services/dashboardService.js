import { prisma } from '../config/database.js';

class DashboardService {
  async getExecutiveDashboard() {
    // Get current date range
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Sales stats
    const salesStats = await prisma.sale.aggregate({
      where: {
        status: 'COMPLETED',
        saleDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: true,
    });

    // Previous month sales
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const prevSalesStats = await prisma.sale.aggregate({
      where: {
        status: 'COMPLETED',
        saleDate: {
          gte: prevMonthStart,
          lte: prevMonthEnd,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Product count
    const productCount = await prisma.product.count({
      where: { isActive: true },
    });

    // User count
    const userCount = await prisma.user.count({
      where: { isActive: true },
    });

    // Low stock alerts
    const lowStockBatches = await prisma.batch.findMany({
      where: {
        status: { in: ['AVAILABLE', 'PARTIAL'] },
        remainingQuantity: {
          lt: prisma.product.minStockQuantity || 10,
        },
      },
      include: {
        product: true,
      },
      take: 10,
    });

    // Expiring soon
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
      },
      orderBy: { expiryDate: 'asc' },
      take: 10,
    });

    // Recent sales
    const recentSales = await prisma.sale.findMany({
      where: { status: 'COMPLETED' },
      include: {
        customer: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Calculate trends
    const currentRevenue = salesStats._sum.totalAmount || 0;
    const prevRevenue = prevSalesStats._sum.totalAmount || 0;
    const revenueTrend = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    return {
      stats: {
        totalRevenue: currentRevenue,
        totalSales: salesStats._count,
        totalProducts: productCount,
        totalUsers: userCount,
        revenueTrend: revenueTrend,
        salesTrend: prevSalesStats._count > 0 
          ? ((salesStats._count - prevSalesStats._count) / prevSalesStats._count) * 100 
          : 0,
      },
      alerts: {
        lowStock: lowStockBatches,
        expiringSoon: expiringBatches,
      },
      recentActivity: recentSales,
    };
  }

  async getRecentActivities(limit = 20) {
    const activities = await prisma.auditLog.findMany({
      where: {
        action: { in: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'] },
      },
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
      take: limit,
    });

    // Format activities for display
    return activities.map((activity) => ({
      id: activity.id,
      type: activity.action.toLowerCase(),
      title: `${activity.action} ${activity.resourceType}`,
      description: `${activity.user?.firstName} ${activity.user?.lastName} performed ${activity.action} on ${activity.resourceType}`,
      time: activity.createdAt,
      user: activity.user,
    }));
  }

  async getAlerts() {
    const alerts = [];

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
      take: 10,
    });

    for (const batch of lowStockBatches) {
      const branch = batch.inventory[0]?.branch;
      alerts.push({
        id: `low-stock-${batch.id}`,
        type: 'warning',
        title: 'Low Stock Alert',
        message: `Product ${batch.product.name} (Batch: ${batch.batchNumber}) has ${batch.remainingQuantity} units remaining${branch ? ` at ${branch.name}` : ''}`,
        time: new Date(),
        action: 'View Batch',
      });
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
      orderBy: { expiryDate: 'asc' },
      take: 10,
    });

    for (const batch of expiringBatches) {
      const daysUntilExpiry = Math.ceil((new Date(batch.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      const branch = batch.inventory[0]?.branch;
      alerts.push({
        id: `expiring-${batch.id}`,
        type: 'warning',
        title: 'Batch Expiring Soon',
        message: `Product ${batch.product.name} (Batch: ${batch.batchNumber}) will expire in ${daysUntilExpiry} days${branch ? ` at ${branch.name}` : ''}`,
        time: new Date(),
        action: 'View Batch',
      });
    }

    // Check pending transfers
    const pendingTransfers = await prisma.transfer.findMany({
      where: { status: 'PENDING' },
      include: {
        fromBranch: true,
        toBranch: true,
      },
      take: 10,
    });

    for (const transfer of pendingTransfers) {
      alerts.push({
        id: `transfer-${transfer.id}`,
        type: 'info',
        title: 'Pending Transfer',
        message: `Transfer ${transfer.transferNumber} from ${transfer.fromBranch.name} to ${transfer.toBranch.name} is awaiting approval`,
        time: transfer.createdAt,
        action: 'Review Transfer',
      });
    }

    // Check pending purchases
    const pendingPurchases = await prisma.purchase.findMany({
      where: { status: 'DRAFT' },
      include: {
        supplier: true,
      },
      take: 10,
    });

    for (const purchase of pendingPurchases) {
      alerts.push({
        id: `purchase-${purchase.id}`,
        type: 'info',
        title: 'Draft Purchase Order',
        message: `Purchase order ${purchase.purchaseNumber} from ${purchase.supplier.name} is in draft status`,
        time: purchase.createdAt,
        action: 'Review Purchase',
      });
    }

    // Sort alerts by priority: warning > info
    return alerts.sort((a, b) => {
      const priority = { warning: 0, error: 1, info: 2, success: 3 };
      return (priority[a.type] || 4) - (priority[b.type] || 4);
    });
  }
}

export default new DashboardService();