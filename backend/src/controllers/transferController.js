import transferService from '../services/transferService.js';
import { 
  createTransferSchema, 
  updateTransferSchema, 
  rejectTransferSchema,
  receiveTransferSchema,
  transferIdSchema 
} from '../validators/transferValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class TransferController {
  async getAll(req, res, next) {
    try {
      const { search, status, fromBranchId, toBranchId, page, limit } = req.query;
      const result = await transferService.getAll({ search, status, fromBranchId, toBranchId, page, limit });

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
      const { id } = transferIdSchema.parse(req.params);
      const transfer = await transferService.getById(id);

      res.json({
        success: true,
        data: transfer,
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
      const data = createTransferSchema.parse(req.body);
      data.createdById = req.user.id;
      const transfer = await transferService.create(data);

      res.status(201).json({
        success: true,
        data: transfer,
        message: 'Transfer created successfully',
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
      const { id } = transferIdSchema.parse(req.params);
      const data = updateTransferSchema.parse(req.body);
      const transfer = await transferService.update(id, data);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer updated successfully',
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
      const { id } = transferIdSchema.parse(req.params);
      const transfer = await transferService.approve(id, req.user.id);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer approved successfully',
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
      const { id } = transferIdSchema.parse(req.params);
      const data = rejectTransferSchema.parse(req.body);
      const transfer = await transferService.reject(id, data, req.user.id);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer rejected',
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
      const { id } = transferIdSchema.parse(req.params);
      const data = receiveTransferSchema.parse(req.body);
      const transfer = await transferService.receive(id, data, req.user.id);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer received successfully',
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
      const { id } = transferIdSchema.parse(req.params);
      const items = await transferService.getItems(id);

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

  async getAvailableBatches(req, res, next) {
    try {
      const { branchId } = req.query;
      
      if (!branchId) {
        throw new AppError('Branch ID is required', 400);
      }

      const batches = await transferService.getAvailableBatches(branchId);

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
      const { id } = transferIdSchema.parse(req.params);
      await transferService.delete(id);

      res.json({
        success: true,
        message: 'Transfer deleted successfully',
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }
}

export default new TransferController();