import customerService from '../services/customerService.js';
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
      const { id } = req.params;
      const customer = await customerService.getById(id);

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const customer = await customerService.create(data);

      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const customer = await customerService.update(id, data);

      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await customerService.delete(id);

      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await customerService.toggleStatus(id);
      const status = customer.isActive ? 'activated' : 'deactivated';
      
      res.json({
        success: true,
        data: customer,
        message: Customer  successfully,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCreditHistory(req, res, next) {
    try {
      const { id } = req.params;
      const result = await customerService.getCreditHistory(id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CustomerController();
