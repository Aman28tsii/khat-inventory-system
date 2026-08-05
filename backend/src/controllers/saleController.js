import saleService from '../services/saleService.js';
import { 
  createSaleSchema, 
  updateSaleSchema, 
  paymentSchema,
  returnSaleSchema,
  saleIdSchema 
} from '../validators/saleValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class SaleController {
  async getAll(req, res, next) {
    try {
      const { search, status, paymentStatus, customerId, branchId, page, limit } = req.query;
      const result = await saleService.getAll({ search, status, paymentStatus, customerId, branchId, page, limit });

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
      const { id } = saleIdSchema.parse(req.params);
      const sale = await saleService.getById(id);

      res.json({
        success: true,
        data: sale,
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
      const data = createSaleSchema.parse(req.body);
      data.createdById = req.user.id;
      const sale = await saleService.create(data);

      res.status(201).json({
        success: true,
        data: sale,
        message: 'Sale created successfully',
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
      const { id } = saleIdSchema.parse(req.params);
      const data = updateSaleSchema.parse(req.body);
      const sale = await saleService.update(id, data);

      res.json({
        success: true,
        data: sale,
        message: 'Sale updated successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const { id } = saleIdSchema.parse(req.params);
      const data = paymentSchema.parse(req.body);
      data.receivedById = req.user.id;
      const sale = await saleService.processPayment(id, data);

      res.json({
        success: true,
        data: sale,
        message: 'Payment processed successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async returnSale(req, res, next) {
    try {
      const { id } = saleIdSchema.parse(req.params);
      const data = returnSaleSchema.parse(req.body);
      data.returnedById = req.user.id;
      const sale = await saleService.returnSale(id, data);

      res.json({
        success: true,
        data: sale,
        message: 'Sale returned successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getPayments(req, res, next) {
    try {
      const { id } = saleIdSchema.parse(req.params);
      const payments = await saleService.getPayments(id);

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getAvailableBatches(req, res, next) {
    try {
      const { productId } = req.query;
      
      if (!productId) {
        throw new AppError('Product ID is required', 400);
      }

      const batches = await saleService.getAvailableBatches(productId);

      res.json({
        success: true,
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = saleIdSchema.parse(req.params);
      await saleService.delete(id);

      res.json({
        success: true,
        message: 'Sale deleted successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new SaleController();