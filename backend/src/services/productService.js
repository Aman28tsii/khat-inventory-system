import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class ProductService {
  async getAll(filters = {}) {
    const { search, category, status, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          batches: {
            select: {
              id: true,
              batchNumber: true,
              remainingQuantity: true,
              status: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { data: products, total };
  }

  async getById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        batches: {
          include: {
            supplier: true,
            inventory: {
              include: {
                branch: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async create(data) {
    const existingProduct = await prisma.product.findFirst({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      throw new AppError('Product with this SKU already exists', 400);
    }

    return prisma.product.create({
      data,
    });
  }

  async update(id, data) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // If SKU is being updated, check uniqueness
    if (data.sku && data.sku !== product.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: { sku: data.sku },
      });

      if (existingProduct) {
        throw new AppError('Product with this SKU already exists', 400);
      }
    }

    return prisma.product.update({
      where: { id },
      data,
      include: {
        batches: true,
      },
    });
  }

  async delete(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        batches: true,
      },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if product has batches
    if (product.batches.length > 0) {
      throw new AppError('Cannot delete product with existing batches', 400);
    }

    await prisma.product.delete({ where: { id } });
    return { success: true };
  }

  async toggleStatus(id) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  }
}

export default new ProductService();