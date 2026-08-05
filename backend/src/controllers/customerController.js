import customerService from '../services/customerService.js';
import { createCustomerSchema, updateCustomerSchema, customerIdSchema } from '../validators/customerValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class CustomerController {
  async getAll(req, res, next) {
    try {
      const { search, type, status, page, limit } = req.query;
      const result = await customerService.getAll({ search, type, status, page, limit });

      res.json({
        success: true,
        data: result.data,
        total: result.total,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = customerIdSchema.parse(req.params);
      const customer = await customerService.getById(id);

      res.json({
        success: true,
        data: customer,
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
      const data = createCustomerSchema.parse(req.body);
      const customer = await customerService.create(data);

      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully',
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
      const { id } = customerIdSchema.parse(req.params);
      const data = updateCustomerSchema.parse(req.body);
      const customer = await customerService.update(id, data);

      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully',
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
      const { id } = customerIdSchema.parse(req.params);
      await customerService.delete(id);

      res.json({
        success: true,
        message: 'Customer deleted successfully',
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
      const { id } = customerIdSchema.parse(req.params);
      const customer = await customerService.toggleStatus(id);

      res.json({
        success: true,
        data: customer,
        message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getCreditHistory(req, res, next) {
    try {
      const { id } = customerIdSchema.parse(req.params);
      const result = await customerService.getCreditHistory(id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new CustomerController();