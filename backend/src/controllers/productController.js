import productService from '../services/productService.js';
import { AppError } from '../middlewares/errorHandler.js';

class ProductController {
  async getAll(req, res, next) {
    try {
      const { search, category, status, page, limit } = req.query;
      const result = await productService.getAll({ search, category, status, page, limit });
      res.json({ success: true, data: result.data, total: result.total, page: parseInt(page) || 1, limit: parseInt(limit) || 10 });
    } catch (error) { next(error); }
  }
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);
      res.json({ success: true, data: product });
    } catch (error) { next(error); }
  }
  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: product, message: 'Product created' });
    } catch (error) { next(error); }
  }
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      res.json({ success: true, data: product, message: 'Product updated' });
    } catch (error) { next(error); }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error) { next(error); }
  }
  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.toggleStatus(id);
      res.json({ success: true, data: product, message: product.isActive ? 'Product activated' : 'Product deactivated' });
    } catch (error) { next(error); }
  }
}
export default new ProductController();
