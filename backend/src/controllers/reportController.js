import reportService from '../services/reportService.js';
import { AppError } from '../middlewares/errorHandler.js';

class ReportController {
  async getInventoryReport(req, res, next) {
    try {
      const { branchId, productId, status, startDate, endDate } = req.query;
      const result = await reportService.getInventoryReport({
        branchId,
        productId,
        status,
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSalesReport(req, res, next) {
    try {
      const { branchId, customerId, productId, startDate, endDate, status } = req.query;
      const result = await reportService.getSalesReport({
        branchId,
        customerId,
        productId,
        startDate,
        endDate,
        status,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfitReport(req, res, next) {
    try {
      const { branchId, startDate, endDate } = req.query;
      const result = await reportService.getProfitReport({
        branchId,
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchComparison(req, res, next) {
    try {
      const result = await reportService.getBranchComparison();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSupplierReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const result = await reportService.getSupplierReport({
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBranchReport(req, res, next) {
    try {
      const { branchId, startDate, endDate } = req.query;
      const result = await reportService.getBranchReport({
        branchId,
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();