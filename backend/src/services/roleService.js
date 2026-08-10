import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class RoleService {
  async getAll() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: { level: 'desc' },
    });
  }

  async getById(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async create(data) {
    const existing = await prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new AppError('Role with this name already exists', 400);
    }

    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        level: data.level || 1,
        isSystem: data.isSystem || false,
      },
    });
  }

  async update(id, data) {
    const role = await prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem) {
      throw new AppError('Cannot modify system roles', 400);
    }

    if (data.name && data.name !== role.name) {
      const existing = await prisma.role.findUnique({
        where: { name: data.name },
      });

      if (existing) {
        throw new AppError('Role with this name already exists', 400);
      }
    }

    return prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        level: data.level,
      },
    });
  }

  async delete(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem) {
      throw new AppError('Cannot delete system roles', 400);
    }

    if (role.users.length > 0) {
      throw new AppError('Cannot delete role with assigned users', 400);
    }

    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    await prisma.role.delete({ where: { id } });
    return { success: true };
  }

  async assignPermissions(roleId, permissionIds) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem) {
      throw new AppError('Cannot modify system roles', 400);
    }

    // Delete existing permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Add new permissions
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    if (rolePermissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: rolePermissions,
      });
    }

    return this.getById(roleId);
  }

  async removePermission(roleId, permissionId) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (role.isSystem) {
      throw new AppError('Cannot modify system roles', 400);
    }

    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    return this.getById(roleId);
  }
}

export default new RoleService();
