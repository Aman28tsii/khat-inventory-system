import dashboardService from '../services/dashboardService.js';

class DashboardController {
  async getExecutive(req, res, next) {
    try {
      const data = await dashboardService.getExecutiveDashboard();

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivities(req, res, next) {
    try {
      const { limit = 20 } = req.query;
      const activities = await dashboardService.getRecentActivities(parseInt(limit));

      res.json({
        success: true,
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlerts(req, res, next) {
    try {
      const alerts = await dashboardService.getAlerts();

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();