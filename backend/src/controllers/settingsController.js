import settingsService from '../services/settingsService.js';
import { AppError } from '../middlewares/errorHandler.js';

class SettingsController {
  async getAll(req, res, next) {
    try {
      const settings = await settingsService.getAll();
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByKey(req, res, next) {
    try {
      const { key } = req.params;
      const setting = await settingsService.getByKey(key);
      res.json({
        success: true,
        data: setting,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const setting = await settingsService.create(req.body);
      res.status(201).json({
        success: true,
        data: setting,
        message: 'Setting created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { key } = req.params;
      const setting = await settingsService.update(key, req.body);
      res.json({
        success: true,
        data: setting,
        message: 'Setting updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { key } = req.params;
      await settingsService.delete(key);
      res.json({
        success: true,
        message: 'Setting deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SettingsController();
