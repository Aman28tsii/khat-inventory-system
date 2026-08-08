import supplierService from '../services/supplierService.js';
import { AppError } from '../middlewares/errorHandler.js';

class SupplierController {
  async getAll(req, res, next) {
    try {
      const { search, status, page, limit } = req.query;
      const result = await supplierService.getAll({ search, status, page, limit });
      res.json({ success: true, data: result.data, total: result.total, page: parseInt(page) || 1, limit: parseInt(limit) || 10 });
    } catch (error) { next(error); }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await supplierService.getById(id);
      res.json({ success: true, data: supplier });
    } catch (error) { next(error); }
  }
  async create(req, res, next) {
    try {
      const supplier = await supplierService.create(req.body);
      res.status(201).json({ success: true, data: supplier, message: 'Supplier created' });
    } catch (error) { next(error); }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await supplierService.update(id, req.body);
      res.json({ success: true, data: supplier, message: 'Supplier updated' });
    } catch (error) { next(error); }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await supplierService.delete(id);
      res.json({ success: true, message: 'Supplier deleted' });
    } catch (error) { next(error); }
  }
  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await supplierService.toggleStatus(id);
      res.json({ success: true, data: supplier, message: supplier.isActive ? 'Supplier activated' : 'Supplier deactivated' });
    } catch (error) { next(error); }
  }
}
export default new SupplierController();
