import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class SettingsService {
  async getAll() {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });

    // Decrypt values if needed
    return settings.map(setting => ({
      ...setting,
      value: setting.isEncrypted ? '***encrypted***' : setting.value,
    }));
  }

  async getByKey(key) {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    return {
      ...setting,
      value: setting.isEncrypted ? '***encrypted***' : setting.value,
    };
  }

  async create(data) {
    const existing = await prisma.setting.findUnique({
      where: { key: data.key },
    });

    if (existing) {
      throw new AppError('Setting with this key already exists', 400);
    }

    // In production, encrypt sensitive values here
    return prisma.setting.create({
      data: {
        key: data.key,
        value: data.value,
        category: data.category,
        isEncrypted: data.isEncrypted || false,
      },
    });
  }

  async update(key, data) {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    return prisma.setting.update({
      where: { key },
      data: {
        value: data.value,
        category: data.category,
        isEncrypted: data.isEncrypted,
      },
    });
  }

  async delete(key) {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      throw new AppError('Setting not found', 404);
    }

    await prisma.setting.delete({ where: { key } });
    return { success: true };
  }
}

export default new SettingsService();
