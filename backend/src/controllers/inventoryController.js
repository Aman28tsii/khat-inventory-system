import inventoryService from '../services/inventoryService.js';
import { AppError } from '../middlewares/errorHandler.js';

class InventoryController {
  async getAll(req, res, next) {
    try {
      const { branchId, productId, batchId, page, limit } = req.query;
      const result = await inventoryService.getAll({ branchId, productId, batchId, page, limit });

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

  async getByBatch(req, res, next) {
    try {
      const { batchId } = req.params;
      const inventory = await inventoryService.getByBatch(batchId);

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByBranch(req, res, next) {
    try {
      const { branchId } = req.params;
      const inventory = await inventoryService.getByBranch(branchId);

      res.json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const { branchId } = req.query;
      const items = await inventoryService.getLowStock(branchId);

      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getExpiring(req, res, next) {
    try {
      const { days = 30, branchId } = req.query;
      const items = await inventoryService.getExpiring(parseInt(days), branchId);

      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStockMovements(req, res, next) {
    try {
      const { batchId, branchId, productId, startDate, endDate, page, limit } = req.query;
      const result = await inventoryService.getStockMovements({
        batchId,
        branchId,
        productId,
        startDate,
        endDate,
        page,
        limit,
      });

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
}

export default new InventoryController();
