import { AppError } from '../middlewares/errorHandler.js';

// Mock data
let customers = [
  { id: '1', name: 'John Doe', code: 'CUST-001', phone: '+251-911-1234', email: 'john@example.com', isActive: true },
  { id: '2', name: 'Jane Smith', code: 'CUST-002', phone: '+251-922-5678', email: 'jane@example.com', isActive: true },
];

class CustomerController {
  async getAll(req, res, next) {
    try {
      res.json({
        success: true,
        data: customers,
        total: customers.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = customers.find(c => c.id === id);
      if (!customer) {
        throw new AppError('Customer not found', 404);
      }
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, code, phone, email } = req.body;
      const newCustomer = {
        id: String(customers.length + 1),
        name,
        code,
        phone,
        email,
        isActive: true,
      };
      customers.push(newCustomer);
      res.status(201).json({
        success: true,
        data: newCustomer,
        message: 'Customer created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const index = customers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new AppError('Customer not found', 404);
      }
      customers[index] = { ...customers[index], ...req.body };
      res.json({
        success: true,
        data: customers[index],
        message: 'Customer updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      customers = customers.filter(c => c.id !== id);
      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CustomerController();
