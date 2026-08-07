import roleService from '../services/roleService.js';
import { AppError } from '../middlewares/errorHandler.js';

class RoleController {
  async getAll(req, res, next) {
    try {
      const roles = await roleService.getAll();
      res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.getById(id);
      res.json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const role = await roleService.create(data);
      res.status(201).json({
        success: true,
        data: role,
        message: 'Role created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const role = await roleService.update(id, data);
      res.json({
        success: true,
        data: role,
        message: 'Role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await roleService.delete(id);
      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async assignPermissions(req, res, next) {
    try {
      const { id } = req.params;
      const { permissions } = req.body;
      const role = await roleService.assignPermissions(id, permissions);
      res.json({
        success: true,
        data: role,
        message: 'Permissions assigned successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removePermission(req, res, next) {
    try {
      const { id, permissionId } = req.params;
      const role = await roleService.removePermission(id, permissionId);
      res.json({
        success: true,
        data: role,
        message: 'Permission removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();