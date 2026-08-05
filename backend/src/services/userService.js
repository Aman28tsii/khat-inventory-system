import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import authService from './authService.js';

class UserService {
  async getAll(filters = {}) {
    const { search, role, status, branchId } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.roleId = role;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        role: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.user.count({ where });

    return { data: users, total };
  }

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
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
        branch: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash, ...userData } = user;
    return {
      ...userData,
      permissions: user.role.permissions.map((p) => p.permission),
    };
  }

  async create(data) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { employeeId: data.employeeId }],
      },
    });

    if (existingUser) {
      throw new AppError('User with this email or employee ID already exists', 400);
    }

    const hashedPassword = await authService.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        employeeId: data.employeeId,
        roleId: data.roleId,
        branchId: data.branchId,
        phone: data.phone,
        isActive: true,
        isVerified: true,
      },
      include: {
        role: true,
        branch: true,
      },
    });

    const { passwordHash, ...userData } = user;
    return userData;
  }

  async update(id, data) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updateData = { ...data };
    delete updateData.password;
    delete updateData.id;

    if (data.password) {
      updateData.passwordHash = await authService.hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
        branch: true,
      },
    });

    const { passwordHash, ...userData } = updatedUser;
    return userData;
  }

  async delete(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent deleting the last admin
    const adminCount = await prisma.user.count({
      where: {
        role: { name: 'SUPER_ADMIN' },
        isActive: true,
      },
    });

    if (adminCount === 1 && user.role?.name === 'SUPER_ADMIN') {
      throw new AppError('Cannot delete the last system admin', 400);
    }

    await prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async toggleStatus(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      include: {
        role: true,
        branch: true,
      },
    });

    const { passwordHash, ...userData } = updatedUser;
    return userData;
  }

  async updateRole(id, roleId) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roleId },
      include: {
        role: true,
        branch: true,
      },
    });

    const { passwordHash, ...userData } = updatedUser;
    return userData;
  }

  async resetPassword(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tempPassword = 'Temp@123';
    const hashedPassword = await authService.hashPassword(tempPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });

    return { success: true, tempPassword };
  }
}

export default new UserService();