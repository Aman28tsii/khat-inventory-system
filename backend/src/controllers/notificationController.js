import notificationService from '../services/notificationService.js';
import { AppError } from '../middlewares/errorHandler.js';

class NotificationController {
  async getAll(req, res, next) {
    try {
      const { page, limit, type, isRead } = req.query;
      const userId = req.user.id;

      const result = await notificationService.getAll({
        userId,
        type,
        isRead,
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

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: count,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.markAsRead(id);

      res.json({
        success: true,
        data: notification,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        data: result,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  }

  async archive(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.archive(id);

      res.json({
        success: true,
        data: notification,
        message: 'Notification archived',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.delete(id);

      res.json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(req, res, next) {
    try {
      const userId = req.user.id;
      await notificationService.deleteAll(userId);

      res.json({
        success: true,
        message: 'All notifications deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const preferences = await notificationService.getPreferences(userId);

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;
      const preferences = await notificationService.updatePreferences(userId, data);

      res.json({
        success: true,
        data: preferences,
        message: 'Preferences updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();