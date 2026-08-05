import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class ReportService {
  async getInventoryReport(filters = {}) {
    const { branchId, productId, status, startDate, endDate } = filters;

    const where = {};

    if (branchId) {
      where.inventory = { some: { branchId } };
    }

    if (productId) {
      where.productId = productId;
    }

    if (status) {
      where.status = status;
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

    const batches = await prisma.batch.findMany({
      where,
      include: {
        product: true,
        supplier: true,
        inventory: {
          include: {
            branch: true,
          },
        },
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate summary statistics
    const summary = {
      totalBatches: batches.length,
      totalQuantity: batches.reduce((sum, b) => sum + b.quantity, 0),
      totalRemaining: batches.reduce((sum, b) => sum + b.remainingQuantity, 0),
      totalValue: batches.reduce((sum, b) => sum + (b.remainingQuantity * b.purchasePrice), 0),
      lowStockCount: batches.filter(b => {
        const inventory = b.inventory[0];
        return inventory && inventory.availableQuantity < (b.product?.minStockQuantity || 0);
      }).length,
      expiringCount: batches.filter(b => {
        const daysUntilExpiry = b.expiryDate ? Math.ceil((new Date(b.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : Infinity;
        return daysUntilExpiry < 30 && daysUntilExpiry > 0;
      }).length,
    };

    return {
      data: batches,
      summary,
    };
  }

  async getSalesReport(filters = {}) {
    const { branchId, customerId, productId, startDate, endDate, status } = filters;

    const where = {};

    if (branchId) {
      where.branchId = branchId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) {
        where.saleDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.saleDate.lte = new Date(endDate);
      }
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: true,
        branch: true,
        items: {
          include: {
            batch: {
              include: {
                product: true,
              },
            },
          },
        },
        payments: true,
      },
      orderBy: { saleDate: 'desc' },
    });

    // Calculate summary
    const summary = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, s) => sum + s.totalAmount, 0),
      totalPaid: sales.reduce((sum, s) => sum + s.paidAmount, 0),
      totalDue: sales.reduce((sum, s) => sum + s.dueAmount, 0),
      averageOrderValue: sales.length > 0 ? sales.reduce((sum, s) => sum + s.totalAmount, 0) / sales.length : 0,
      topProducts: [],
    };

    // Calculate top products
    const productMap = {};
    for (const sale of sales) {
      for (const item of sale.items) {
        const productName = item.batch?.product?.name || 'Unknown';
        if (!productMap[productName]) {
          productMap[productName] = 0;
        }
        productMap[productName] += item.quantity;
      }
    }

    summary.topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    return {
      data: sales,
      summary,
    };
  }

  async getProfitReport(filters = {}) {
    const { branchId, startDate, endDate } = filters;

    const where = {};
    if (branchId) {
      where.branchId = branchId;
    }

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) {
        where.saleDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.saleDate.lte = new Date(endDate);
      }
    }

    // Get all sales with items
    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            batch: true,
          },
        },
        payments: true,
      },
      orderBy: { saleDate: 'asc' },
    });

    // Calculate profit per sale
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    const dailyData = {};

    for (const sale of sales) {
      let saleCost = 0;
      let saleRevenue = sale.totalAmount;

      for (const item of sale.items) {
        // Cost is based on purchase price of the batch
        const cost = item.batch?.purchasePrice || 0;
        saleCost += cost * item.quantity;
      }

      const profit = saleRevenue - saleCost;
      totalRevenue += saleRevenue;
      totalCost += saleCost;
      totalProfit += profit;

      // Daily aggregation
      const date = sale.saleDate.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { revenue: 0, cost: 0, profit: 0 };
      }
      dailyData[date].revenue += saleRevenue;
      dailyData[date].cost += saleCost;
      dailyData[date].profit += profit;
    }

    const dailySummary = Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data,
      margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
    }));

    return {
      summary: {
        totalSales: sales.length,
        totalRevenue,
        totalCost,
        totalProfit,
        averageMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      },
      dailyData: dailySummary,
      sales: sales.slice(0, 20), // Limit for performance
    };
  }

  async getBranchComparison() {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      include: {
        sales: {
          include: {
            items: true,
          },
        },
        purchases: {
          include: {
            items: true,
          },
        },
      },
    });

    const comparison = branches.map((branch) => {
      const totalSales = branch.sales.reduce((sum, s) => sum + s.totalAmount, 0);
      const totalPurchases = branch.purchases.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalSalesCount = branch.sales.length;
      const totalPurchaseCount = branch.purchases.length;

      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        type: branch.type,
        totalSales,
        totalPurchases,
        totalSalesCount,
        totalPurchaseCount,
        netRevenue: totalSales - totalPurchases,
        averageSaleValue: totalSalesCount > 0 ? totalSales / totalSalesCount : 0,
      };
    });

    return comparison;
  }

  async getSupplierReport(filters = {}) {
    const { startDate, endDate } = filters;

    const where = {};
    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) {
        where.purchaseDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.purchaseDate.lte = new Date(endDate);
      }
    }

    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      include: {
        purchases: {
          where,
          include: {
            items: true,
          },
        },
        batches: {
          include: {
            inventory: true,
          },
        },
      },
    });

    const report = suppliers.map((supplier) => {
      const totalPurchases = supplier.purchases.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalItems = supplier.purchases.reduce((sum, p) => sum + p.items.length, 0);
      const totalBatches = supplier.batches.length;
      const averagePurchaseValue = supplier.purchases.length > 0 ? totalPurchases / supplier.purchases.length : 0;

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierCode: supplier.code,
        totalPurchases: supplier.purchases.length,
        totalPurchaseValue: totalPurchases,
        totalItems,
        totalBatches,
        averagePurchaseValue,
        rating: supplier.rating,
        paymentTerms: supplier.paymentTerms,
      };
    });

    return report;
  }

  async getBranchReport(filters = {}) {
    const { branchId, startDate, endDate } = filters;

    const where = {};
    if (branchId) {
      where.id = branchId;
    }

    const branches = await prisma.branch.findMany({
      where,
      include: {
        sales: {
          where: startDate || endDate ? {
            saleDate: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          } : {},
          include: {
            items: true,
            payments: true,
          },
        },
        purchases: {
          where: startDate || endDate ? {
            purchaseDate: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          } : {},
          include: {
            items: true,
          },
        },
        inventory: {
          include: {
            batch: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    const report = branches.map((branch) => {
      const totalSales = branch.sales.reduce((sum, s) => sum + s.totalAmount, 0);
      const totalPurchases = branch.purchases.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalPayments = branch.sales.reduce((sum, s) => sum + s.paidAmount, 0);
      const totalInventoryValue = branch.inventory.reduce((sum, i) => sum + (i.currentQuantity * (i.batch?.purchasePrice || 0)), 0);
      const totalInventoryItems = branch.inventory.reduce((sum, i) => sum + i.currentQuantity, 0);

      return {
        branchId: branch.id,
        branchName: branch.name,
        branchCode: branch.code,
        type: branch.type,
        totalSales,
        totalPurchases,
        totalPayments,
        totalInventoryValue,
        totalInventoryItems,
        netRevenue: totalSales - totalPurchases,
        salesCount: branch.sales.length,
        purchaseCount: branch.purchases.length,
      };
    });

    return report;
  }
}

export default new ReportService();