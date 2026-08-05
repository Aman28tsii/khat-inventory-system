import supplierService from '../services/supplierService.js';
import { createSupplierSchema, updateSupplierSchema, supplierIdSchema } from '../validators/supplierValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class SupplierController {
  async getAll(req, res, next) {
    try {
      const { search, status, page, limit } = req.query;
      const result = await supplierService.getAll({ search, status, page, limit });

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
      const { id } = supplierIdSchema.parse(req.params);
      const supplier = await supplierService.getById(id);

      res.json({
        success: true,
        data: supplier,
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
      const data = createSupplierSchema.parse(req.body);
      const supplier = await supplierService.create(data);

      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Supplier created successfully',
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
      const { id } = supplierIdSchema.parse(req.params);
      const data = updateSupplierSchema.parse(req.body);
      const supplier = await supplierService.update(id, data);

      res.json({
        success: true,
        data: supplier,
        message: 'Supplier updated successfully',
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
      const { id } = supplierIdSchema.parse(req.params);
      await supplierService.delete(id);

      res.json({
        success: true,
        message: 'Supplier deleted successfully',
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
      const { id } = supplierIdSchema.parse(req.params);
      const supplier = await supplierService.toggleStatus(id);

      res.json({
        success: true,
        data: supplier,
        message: `Supplier ${supplier.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new SupplierController();