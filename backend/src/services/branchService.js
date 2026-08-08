import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class BranchService {
  async getAll() {
    return prisma.branch.findMany({
      include: {
        company: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id) {
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        company: true,
        users: true,
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

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    return branch;
  }

  async create(data) {
    // Check if branch code already exists
    const existing = await prisma.branch.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new AppError('Branch with this code already exists', 400);
    }

    return prisma.branch.create({
      data: {
        name: data.name,
        code: data.code,
        type: data.type,
        address: data.address,
        phone: data.phone,
        email: data.email,
        companyId: data.companyId,
        isActive: data.isActive !== undefined ? data.isActive : true,
        settings: data.settings || {},
      },
    });
  }

  async update(id, data) {
    const branch = await prisma.branch.findUnique({ where: { id } });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    // If code is being updated, check uniqueness
    if (data.code && data.code !== branch.code) {
      const existing = await prisma.branch.findUnique({
        where: { code: data.code },
      });

      if (existing) {
        throw new AppError('Branch with this code already exists', 400);
      }
    }

    return prisma.branch.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        users: true,
        inventory: true,
      },
    });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    // Check if branch has users or inventory
    if (branch.users.length > 0 || branch.inventory.length > 0) {
      throw new AppError('Cannot delete branch with existing users or inventory', 400);
    }

    await prisma.branch.delete({ where: { id } });
    return { success: true };
  }

  async toggleStatus(id) {
    const branch = await prisma.branch.findUnique({ where: { id } });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    return prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive },
    });
  }
}

export default new BranchService();
