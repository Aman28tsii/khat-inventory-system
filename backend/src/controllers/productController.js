import productService from '../services/productService.js';
import { createProductSchema, updateProductSchema, productIdSchema } from '../validators/productValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class ProductController {
  async getAll(req, res, next) {
    try {
      const { search, category, status, page, limit } = req.query;
      const result = await productService.getAll({ search, category, status, page, limit });

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
      const { id } = productIdSchema.parse(req.params);
      const product = await productService.getById(id);

      res.json({
        success: true,
        data: product,
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
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(data);

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
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
      const { id } = productIdSchema.parse(req.params);
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(id, data);

      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully',
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
      const { id } = productIdSchema.parse(req.params);
      await productService.delete(id);

      res.json({
        success: true,
        message: 'Product deleted successfully',
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
      const { id } = productIdSchema.parse(req.params);
      const product = await productService.toggleStatus(id);

      res.json({
        success: true,
        data: product,
        message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new ProductController();