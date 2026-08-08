import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class InventoryService {
  async getAll(filters = {}) {
    const { branchId, productId, batchId, page = 1, limit = 10 } = filters;

    const where = {};

    if (branchId) {
      where.branchId = branchId;
    }

    if (batchId) {
      where.batchId = batchId;
    }

    if (productId) {
      where.batch = { productId };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          batch: {
            include: {
              product: true,
              supplier: true,
            },
          },
          branch: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.inventory.count({ where }),
    ]);

    return { data: inventory, total };
  }

  async getByBatch(batchId) {
    const inventory = await prisma.inventory.findMany({
      where: { batchId },
      include: {
        branch: true,
        batch: {
          include: {
            product: true,
            supplier: true,
          },
        },
      },
    });

    if (!inventory || inventory.length === 0) {
      throw new AppError('Inventory not found for this batch', 404);
    }

    return inventory;
  }

  async getByBranch(branchId) {
    const inventory = await prisma.inventory.findMany({
      where: { branchId },
      include: {
        batch: {
          include: {
            product: true,
            supplier: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return inventory;
  }

  async getLowStock(branchId) {
    const where = {
      availableQuantity: {
        lt: 10, // Threshold for low stock
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return prisma.inventory.findMany({
      where,
      include: {
        batch: {
          include: {
            product: true,
          },
        },
        branch: true,
      },
      orderBy: { availableQuantity: 'asc' },
    });
  }

  async getExpiring(days = 30, branchId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const where = {
      batch: {
        expiryDate: {
          lte: expiryDate,
          gt: new Date(),
        },
        status: {
          in: ['AVAILABLE', 'PARTIAL'],
        },
      },
    };

    if (branchId) {
      where.branchId = branchId;
    }

    return prisma.inventory.findMany({
      where,
      include: {
        batch: {
          include: {
            product: true,
          },
        },
        branch: true,
      },
      orderBy: {
        batch: {
          expiryDate: 'asc',
        },
      },
    });
  }

  async getStockMovements(filters = {}) {
    const { batchId, branchId, productId, startDate, endDate, page = 1, limit = 10 } = filters;

    const where = {};

    if (batchId) {
      where.batchId = batchId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (productId) {
      where.productId = productId;
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

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          batch: {
            include: {
              product: true,
            },
          },
          branch: true,
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { data: movements, total };
  }
}

export default new InventoryService();
