import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class SupplierService {
  async getAll(filters = {}) {
    const { search, status, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          batches: {
            select: {
              id: true,
              batchNumber: true,
              quantity: true,
              remainingQuantity: true,
              status: true,
            },
          },
          purchases: {
            select: {
              id: true,
              purchaseNumber: true,
              totalAmount: true,
              status: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supplier.count({ where }),
    ]);

    return { data: suppliers, total };
  }

  async getById(id) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        batches: true,
        purchases: {
          include: {
            items: true,
            branch: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return supplier;
  }

  async create(data) {
    const existingSupplier = await prisma.supplier.findFirst({
      where: { code: data.code },
    });

    if (existingSupplier) {
      throw new AppError('Supplier with this code already exists', 400);
    }

    return prisma.supplier.create({
      data,
    });
  }

  async update(id, data) {
    const supplier = await prisma.supplier.findUnique({ where: { id } });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    // If code is being updated, check uniqueness
    if (data.code && data.code !== supplier.code) {
      const existingSupplier = await prisma.supplier.findFirst({
        where: { code: data.code },
      });

      if (existingSupplier) {
        throw new AppError('Supplier with this code already exists', 400);
      }
    }

    return prisma.supplier.update({
      where: { id },
      data,
      include: {
        batches: true,
        purchases: true,
      },
    });
  }

  async delete(id) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        batches: true,
        purchases: true,
      },
    });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    // Check if supplier has batches or purchases
    if (supplier.batches.length > 0 || supplier.purchases.length > 0) {
      throw new AppError('Cannot delete supplier with existing transactions', 400);
    }

    await prisma.supplier.delete({ where: { id } });
    return { success: true };
  }

  async toggleStatus(id) {
    const supplier = await prisma.supplier.findUnique({ where: { id } });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    return prisma.supplier.update({
      where: { id },
      data: { isActive: !supplier.isActive },
    });
  }
}

export default new SupplierService();