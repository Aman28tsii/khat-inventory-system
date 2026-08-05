import auditService from '../services/auditService.js';
import { AppError } from '../middlewares/errorHandler.js';

class AuditController {
  async getAll(req, res, next) {
    try {
      const { 
        search, 
        resourceType, 
        action, 
        userId, 
        startDate, 
        endDate,
        page, 
        limit 
      } = req.query;

      const result = await auditService.getAll({
        search,
        resourceType,
        action,
        userId,
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
        limit: parseInt(limit) || 20,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const log = await auditService.getById(id);

      res.json({
        success: true,
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  async getResources(req, res, next) {
    try {
      const resources = await auditService.getResources();

      res.json({
        success: true,
        data: resources,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActions(req, res, next) {
    try {
      const actions = await auditService.getActions();

      res.json({
        success: true,
        data: actions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserActivity(req, res, next) {
    try {
      const { userId } = req.params;
      const { days = 30 } = req.query;

      const activity = await auditService.getUserActivity(userId, parseInt(days));

      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await auditService.delete(id);

      res.json({
        success: true,
        message: 'Audit log deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteOld(req, res, next) {
    try {
      const { days = 90 } = req.query;
      const result = await auditService.deleteOld(parseInt(days));

      res.json({
        success: true,
        data: result,
        message: `${result.deleted} old audit logs deleted`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditController();