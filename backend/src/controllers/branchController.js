import branchService from '../services/branchService.js';
import { AppError } from '../middlewares/errorHandler.js';

class BranchController {
  async getAll(req, res, next) {
    try {
      const branches = await branchService.getAll();
      res.json({ success: true, data: branches });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const branch = await branchService.getById(id);
      res.json({ success: true, data: branch });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const branch = await branchService.create(req.body);
      res.status(201).json({ success: true, data: branch, message: 'Branch created' });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const branch = await branchService.update(id, req.body);
      res.json({ success: true, data: branch, message: 'Branch updated' });
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await branchService.delete(id);
      res.json({ success: true, message: 'Branch deleted' });
    } catch (error) { next(error); }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const branch = await branchService.toggleStatus(id);
      res.json({ success: true, data: branch, message: branch.isActive ? 'Branch activated' : 'Branch deactivated' });
    } catch (error) { next(error); }
  }
}

export default new BranchController();
