import userService from '../services/userService.js';
import { createUserSchema, updateUserSchema, userIdSchema, updateUserRoleSchema } from '../validators/userValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const { search, role, status, branchId } = req.query;
      const result = await userService.getAll({ search, role, status, branchId });

      res.json({
        success: true,
        data: result.data,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const user = await userService.getById(id);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.create(data);

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const data = updateUserSchema.parse(req.body);
      const user = await userService.update(id, data);

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      await userService.delete(id);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const user = await userService.toggleStatus(id);

      res.json({
        success: true,
        data: user,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const { roleId } = updateUserRoleSchema.parse(req.body);
      const user = await userService.updateRole(id, roleId);

      res.json({
        success: true,
        data: user,
        message: 'User role updated successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { id } = userIdSchema.parse(req.params);
      const result = await userService.resetPassword(id);

      res.json({
        success: true,
        data: result,
        message: 'Password reset successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new UserController();