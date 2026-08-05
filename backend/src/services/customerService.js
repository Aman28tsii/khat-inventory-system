import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class CustomerService {
  async getAll(filters = {}) {
    const { search, type, status, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          sales: {
            select: {
              id: true,
              saleNumber: true,
              totalAmount: true,
              paidAmount: true,
              status: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return { data: customers, total };
  }

  async getById(id) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          include: {
            items: true,
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer;
  }

  async create(data) {
    const existingCustomer = await prisma.customer.findFirst({
      where: { code: data.code },
    });

    if (existingCustomer) {
      throw new AppError('Customer with this code already exists', 400);
    }

    return prisma.customer.create({
      data: {
        ...data,
        currentCredit: 0,
      },
    });
  }

  async update(id, data) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // If code is being updated, check uniqueness
    if (data.code && data.code !== customer.code) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { code: data.code },
      });

      if (existingCustomer) {
        throw new AppError('Customer with this code already exists', 400);
      }
    }

    return prisma.customer.update({
      where: { id },
      data,
      include: {
        sales: true,
      },
    });
  }

  async delete(id) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    if (customer.sales.length > 0) {
      throw new AppError('Cannot delete customer with existing sales', 400);
    }

    await prisma.customer.delete({ where: { id } });
    return { success: true };
  }

  async toggleStatus(id) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.customer.update({
      where: { id },
      data: { isActive: !customer.isActive },
    });
  }

  async getCreditHistory(id) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          include: {
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // Build credit history from sales and payments
    const history = [];
    let balance = 0;

    // Process sales in reverse chronological order for proper balance
    const sortedSales = [...customer.sales].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    for (const sale of sortedSales) {
      // Sale transaction
      const saleTransaction = {
        id: sale.id,
        type: 'SALE',
        amount: sale.totalAmount,
        date: sale.createdAt,
        description: `Sale #${sale.saleNumber}`,
        balance: 0,
      };
      balance += sale.totalAmount;
      saleTransaction.balance = balance;
      history.push(saleTransaction);

      // Payment transactions
      for (const payment of sale.payments) {
        const paymentTransaction = {
          id: payment.id,
          type: 'PAYMENT',
          amount: -payment.amount,
          date: payment.createdAt,
          description: `Payment for Sale #${sale.saleNumber}`,
          balance: 0,
        };
        balance -= payment.amount;
        paymentTransaction.balance = balance;
        history.push(paymentTransaction);
      }
    }

    // Sort by date descending for display
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      customer,
      creditHistory: history,
      currentBalance: customer.currentCredit || 0,
    };
  }

  async updateCredit(id, amount) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const newCredit = (customer.currentCredit || 0) + amount;

    return prisma.customer.update({
      where: { id },
      data: { currentCredit: newCredit },
    });
  }
}

export default new CustomerService();