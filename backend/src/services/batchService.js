import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class BatchService {
  async getAll(filters = {}) {
    const { search, productId, status, branchId, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { batchNumber: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (productId) {
      where.productId = productId;
    }

    if (status) {
      where.status = status;
    }

    if (branchId) {
      where.inventory = {
        some: { branchId },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where,
        include: {
          product: true,
          supplier: true,
          inventory: {
            include: {
              branch: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.batch.count({ where }),
    ]);

    return { data: batches, total };
  }

  async getById(id) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        product: true,
        supplier: true,
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        inventory: {
          include: {
            branch: true,
          },
        },
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        transferItems: {
          include: {
            transfer: true,
          },
        },
        saleItems: {
          include: {
            sale: true,
          },
        },
      },
    });

    if (!batch) {
      throw new AppError('Batch not found', 404);
    }

    return batch;
  }

  async create(data) {
    const existingBatch = await prisma.batch.findFirst({
      where: { batchNumber: data.batchNumber },
    });

    if (existingBatch) {
      throw new AppError('Batch with this number already exists', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Start a transaction
    return prisma.$transaction(async (tx) => {
      // Create batch
      const batch = await tx.batch.create({
        data: {
          batchNumber: data.batchNumber,
          productId: data.productId,
          supplierId: data.supplierId,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          quantity: data.quantity,
          remainingQuantity: data.quantity,
          arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : new Date(),
          harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
          grade: data.grade,
          moisturePercentage: data.moisturePercentage,
          freshnessScore: data.freshnessScore,
          leafDensity: data.leafDensity,
          stemRatio: data.stemRatio,
          qualityNotes: data.qualityNotes,
          status: data.status || 'AVAILABLE',
        },
      });

      // Create inventory for branch
      // For now, assign to the first warehouse branch
      const warehouse = await tx.branch.findFirst({
        where: { type: 'WAREHOUSE' },
      });

      if (warehouse) {
        await tx.inventory.create({
          data: {
            batchId: batch.id,
            branchId: warehouse.id,
            currentQuantity: data.quantity,
            availableQuantity: data.quantity,
          },
        });
      }

      return batch;
    });
  }

  async update(id, data) {
    const batch = await prisma.batch.findUnique({ where: { id } });

    if (!batch) {
      throw new AppError('Batch not found', 404);
    }

    // If quantity is being updated, adjust remaining quantity
    if (data.quantity !== undefined) {
      const diff = data.quantity - batch.quantity;
      data.remainingQuantity = batch.remainingQuantity + diff;
    }

    return prisma.batch.update({
      where: { id },
      data,
      include: {
        product: true,
        supplier: true,
      },
    });
  }

  async qualityInspection(id, data) {
    const batch = await prisma.batch.findUnique({ where: { id } });

    if (!batch) {
      throw new AppError('Batch not found', 404);
    }

    return prisma.batch.update({
      where: { id },
      data: {
        ...data,
        inspectionDate: data.inspectionDate ? new Date(data.inspectionDate) : new Date(),
        isQualityChecked: true,
      },
      include: {
        product: true,
        supplier: true,
        inspector: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getExpiringBatches(days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    return prisma.batch.findMany({
      where: {
        expiryDate: {
          lte: expiryDate,
          gt: new Date(),
        },
        status: {
          in: ['AVAILABLE', 'PARTIAL'],
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
    });
  }

  async delete(id) {
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        inventory: true,
        stockMovements: true,
        transferItems: true,
        saleItems: true,
      },
    });

    if (!batch) {
      throw new AppError('Batch not found', 404);
    }

    // Check if batch has any transactions
    if (
      batch.stockMovements.length > 0 ||
      batch.transferItems.length > 0 ||
      batch.saleItems.length > 0
    ) {
      throw new AppError('Cannot delete batch with existing transactions', 400);
    }

    // Delete inventory first
    await prisma.inventory.deleteMany({
      where: { batchId: id },
    });

    await prisma.batch.delete({ where: { id } });
    return { success: true };
  }
}

export default new BatchService();