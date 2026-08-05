import purchaseService from '../services/purchaseService.js';
import { 
  createPurchaseSchema, 
  updatePurchaseSchema, 
  receivePurchaseSchema,
  purchaseIdSchema,
  purchaseItemIdSchema 
} from '../validators/purchaseValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class PurchaseController {
  async getAll(req, res, next) {
    try {
      const { search, status, supplierId, branchId, page, limit } = req.query;
      const result = await purchaseService.getAll({ search, status, supplierId, branchId, page, limit });

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
      const { id } = purchaseIdSchema.parse(req.params);
      const purchase = await purchaseService.getById(id);

      res.json({
        success: true,
        data: purchase,
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
      const data = createPurchaseSchema.parse(req.body);
      data.createdById = req.user.id;
      const purchase = await purchaseService.create(data);

      res.status(201).json({
        success: true,
        data: purchase,
        message: 'Purchase order created successfully',
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
      const { id } = purchaseIdSchema.parse(req.params);
      const data = updatePurchaseSchema.parse(req.body);
      const purchase = await purchaseService.update(id, data);

      res.json({
        success: true,
        data: purchase,
        message: 'Purchase order updated successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async receive(req, res, next) {
    try {
      const { id } = purchaseIdSchema.parse(req.params);
      const data = receivePurchaseSchema.parse(req.body);
      data.receivedById = req.user.id;
      const purchase = await purchaseService.receive(id, data);

      res.json({
        success: true,
        data: purchase,
        message: 'Purchase received successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async approve(req, res, next) {
    try {
      const { id } = purchaseIdSchema.parse(req.params);
      const purchase = await purchaseService.approve(id, req.user.id);

      res.json({
        success: true,
        data: purchase,
        message: 'Purchase order approved successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async reject(req, res, next) {
    try {
      const { id } = purchaseIdSchema.parse(req.params);
      const { notes } = req.body;
      const purchase = await purchaseService.reject(id, { notes });

      res.json({
        success: true,
        data: purchase,
        message: 'Purchase order rejected',
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
      const { id } = purchaseIdSchema.parse(req.params);
      await purchaseService.delete(id);

      res.json({
        success: true,
        message: 'Purchase order deleted successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getItems(req, res, next) {
    try {
      const { id } = purchaseIdSchema.parse(req.params);
      const items = await purchaseService.getItems(id);

      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const { id } = purchaseIdSchema.parse(req.params);
      const data = req.body;
      const item = await purchaseService.addItem(id, data);

      res.status(201).json({
        success: true,
        data: item,
        message: 'Item added successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const { itemId } = purchaseItemIdSchema.parse(req.params);
      await purchaseService.removeItem(itemId);

      res.json({
        success: true,
        message: 'Item removed successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new PurchaseController();