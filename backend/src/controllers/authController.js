import authService from '../services/authService.js';
import { loginSchema, refreshTokenSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidator.js';
import { AppError } from '../middlewares/errorHandler.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      const result = await authService.login(email, password, ipAddress, userAgent);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = refreshTokenSchema.parse(req.body);
      const result = await authService.refreshAccessToken(refreshToken);
      res.json({ success: true, data: result });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const userId = req.user.id;
      await authService.logout(userId);
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const userId = req.user.id;
      await authService.logoutAll(userId);
      res.json({ success: true, message: 'Logged out from all devices' });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }
      const userId = req.user.id;
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      await authService.changePassword(userId, currentPassword, newPassword);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      await authService.forgotPassword(email);
      res.json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(token, newPassword);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      if (error.name === 'ZodError') {
        return next(new AppError(error.errors[0].message, 400));
      }
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized - No user found in request', 401);
      }
      const userId = req.user.id;
      const user = await authService.getCurrentUser(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
