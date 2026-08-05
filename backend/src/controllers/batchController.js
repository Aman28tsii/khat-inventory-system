import batchService from '../services/batchService.js';
import { createBatchSchema, updateBatchSchema, batchIdSchema, qualityInspectionSchema } from '../validators/batchValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class BatchController {
  async getAll(req, res, next) {
    try {
      const { search, productId, status, branchId, page, limit } = req.query;
      const result = await batchService.getAll({ search, productId, status, branchId, page, limit });

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
      const { id } = batchIdSchema.parse(req.params);
      const batch = await batchService.getById(id);

      res.json({
        success: true,
        data: batch,
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
      const data = createBatchSchema.parse(req.body);
      const batch = await batchService.create(data);

      res.status(201).json({
        success: true,
        data: batch,
        message: 'Batch created successfully',
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
      const { id } = batchIdSchema.parse(req.params);
      const data = updateBatchSchema.parse(req.body);
      const batch = await batchService.update(id, data);

      res.json({
        success: true,
        data: batch,
        message: 'Batch updated successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async qualityInspection(req, res, next) {
    try {
      const { id } = batchIdSchema.parse(req.params);
      const data = qualityInspectionSchema.parse(req.body);
      
      // Add inspector ID from authenticated user
      data.inspectorId = req.user.id;
      
      const batch = await batchService.qualityInspection(id, data);

      res.json({
        success: true,
        data: batch,
        message: 'Quality inspection completed successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getExpiring(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const batches = await batchService.getExpiringBatches(parseInt(days));

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
      const { id } = batchIdSchema.parse(req.params);
      await batchService.delete(id);

      res.json({
        success: true,
        message: 'Batch deleted successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new BatchController();