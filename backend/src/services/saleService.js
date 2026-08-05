import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class SaleService {
  async getAll(filters = {}) {
    const { search, status, paymentStatus, customerId, branchId, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { saleNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: true,
          branch: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              batch: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sale.count({ where }),
    ]);

    return { data: sales, total };
  }

  async getById(id) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        branch: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            batch: {
              include: {
                product: true,
              },
            },
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    return sale;
  }

  async create(data) {
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
    });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    // If customer is provided, check if exists
    if (data.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
      });

      if (!customer) {
        throw new AppError('Customer not found', 404);
      }
    }

    // Generate sale number
    const count = await prisma.sale.count();
    const saleNumber = `SA-${String(count + 1).padStart(6, '0')}`;

    // Calculate totals and validate batches
    let subtotal = 0;
    const batchIds = [];

    for (const item of data.items) {
      const batch = await prisma.batch.findUnique({
        where: { id: item.batchId },
        include: {
          inventory: {
            where: { branchId: data.branchId },
          },
        },
      });

      if (!batch) {
        throw new AppError(`Batch with ID ${item.batchId} not found`, 404);
      }

      // Check if batch has enough quantity
      const inventory = batch.inventory[0];
      if (!inventory || inventory.availableQuantity < item.quantity) {
        throw new AppError(`Insufficient quantity for batch ${batch.batchNumber}`, 400);
      }

      batchIds.push(item.batchId);
      subtotal += item.quantity * item.unitPrice - (item.discount || 0);
    }

    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          saleNumber,
          customerId: data.customerId,
          branchId: data.branchId,
          saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
          notes: data.notes,
          subtotal,
          tax: 0,
          discount: 0,
          totalAmount: subtotal,
          paidAmount: 0,
          dueAmount: subtotal,
          status: 'COMPLETED',
          paymentStatus: 'PENDING',
          createdById: data.createdById,
        },
      });

      // Create sale items and update inventory
      for (const item of data.items) {
        const batch = await tx.batch.findUnique({
          where: { id: item.batchId },
        });

        // Create sale item
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            batchId: item.batchId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            discount: item.discount || 0,
            notes: item.notes,
          },
        });

        // Update inventory
        const inventory = await tx.inventory.findFirst({
          where: {
            batchId: item.batchId,
            branchId: data.branchId,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              currentQuantity: { decrement: item.quantity },
              availableQuantity: { decrement: item.quantity },
            },
          });
        }

        // Update batch remaining quantity
        await tx.batch.update({
          where: { id: item.batchId },
          data: {
            remainingQuantity: { decrement: item.quantity },
          },
        });

        // Create stock movement
        await tx.stockMovement.create({
          data: {
            batchId: item.batchId,
            branchId: data.branchId,
            productId: batch.productId,
            movementType: 'SALE',
            quantity: item.quantity,
            previousQuantity: inventory?.currentQuantity || 0,
            newQuantity: (inventory?.currentQuantity || 0) - item.quantity,
            referenceId: sale.id,
            referenceType: 'SALE',
            unitPrice: item.unitPrice,
            totalAmount: item.quantity * item.unitPrice,
            createdBy: data.createdById,
          },
        });
      }

      // Update batch status if remaining quantity is 0
      for (const batchId of batchIds) {
        const batch = await tx.batch.findUnique({
          where: { id: batchId },
        });

        if (batch && batch.remainingQuantity <= 0) {
          await tx.batch.update({
            where: { id: batchId },
            data: { status: 'PARTIAL' },
          });
        }
      }

      // If customer has credit, update credit
      if (data.customerId) {
        await tx.customer.update({
          where: { id: data.customerId },
          data: {
            currentCredit: { increment: subtotal },
          },
        });
      }

      return sale;
    });
  }

  async update(id, data) {
    const sale = await prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    // Prevent update if status is CANCELLED or RETURNED
    if (sale.status === 'CANCELLED' || sale.status === 'RETURNED') {
      throw new AppError('Cannot update a cancelled or returned sale', 400);
    }

    return prisma.sale.update({
      where: { id },
      data,
      include: {
        customer: true,
        branch: true,
        items: {
          include: {
            batch: {
              include: {
                product: true,
              },
            },
          },
        },
        payments: true,
      },
    });
  }

  async processPayment(id, paymentData) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    if (sale.status === 'CANCELLED' || sale.status === 'RETURNED') {
      throw new AppError('Cannot process payment for cancelled or returned sale', 400);
    }

    if (sale.paymentStatus === 'PAID') {
      throw new AppError('Sale is already fully paid', 400);
    }

    // Calculate remaining due
    const remainingDue = sale.totalAmount - sale.paidAmount;

    if (paymentData.amount > remainingDue) {
      throw new AppError('Payment amount exceeds remaining due', 400);
    }

    const newPaidAmount = sale.paidAmount + paymentData.amount;
    let newPaymentStatus = 'PARTIAL';

    if (newPaidAmount >= sale.totalAmount) {
      newPaymentStatus = 'PAID';
    }

    // Generate payment number
    const count = await prisma.payment.count();
    const paymentNumber = `PMT-${String(count + 1).padStart(6, '0')}`;

    return prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          referenceType: 'SALE',
          referenceId: sale.id,
          branchId: sale.branchId,
          paymentDate: new Date(),
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          referenceNumber: paymentData.referenceNumber,
          notes: paymentData.notes,
          receivedById: paymentData.receivedById,
        },
      });

      // Update sale
      const updatedSale = await tx.sale.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: newPaymentStatus,
        },
        include: {
          customer: true,
          branch: true,
          items: {
            include: {
              batch: {
                include: {
                  product: true,
                },
              },
            },
          },
          payments: true,
        },
      });

      // Update customer credit if applicable
      if (sale.customerId) {
        await tx.customer.update({
          where: { id: sale.customerId },
          data: {
            currentCredit: { decrement: paymentData.amount },
          },
        });
      }

      return updatedSale;
    });
  }

  async returnSale(id, returnData) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            batch: {
              include: {
                product: true,
              },
            },
          },
        },
        customer: true,
      },
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    if (sale.status === 'CANCELLED' || sale.status === 'RETURNED') {
      throw new AppError('Sale already cancelled or returned', 400);
    }

    return prisma.$transaction(async (tx) => {
      let totalReturnAmount = 0;

      for (const returnItem of returnData.items) {
        const saleItem = sale.items.find((item) => item.id === returnItem.saleItemId);

        if (!saleItem) {
          throw new AppError(`Sale item ${returnItem.saleItemId} not found`, 404);
        }

        if (returnItem.quantity > saleItem.quantity) {
          throw new AppError(`Return quantity exceeds sale quantity for item`, 400);
        }

        // Update batch and inventory
        const batch = await tx.batch.findUnique({
          where: { id: saleItem.batchId },
        });

        if (batch) {
          await tx.batch.update({
            where: { id: saleItem.batchId },
            data: {
              remainingQuantity: { increment: returnItem.quantity },
            },
          });
        }

        const inventory = await tx.inventory.findFirst({
          where: {
            batchId: saleItem.batchId,
            branchId: sale.branchId,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              currentQuantity: { increment: returnItem.quantity },
              availableQuantity: { increment: returnItem.quantity },
            },
          });
        }

        // Create stock movement
        await tx.stockMovement.create({
          data: {
            batchId: saleItem.batchId,
            branchId: sale.branchId,
            productId: batch.productId,
            movementType: 'RETURN',
            quantity: returnItem.quantity,
            previousQuantity: inventory?.currentQuantity || 0,
            newQuantity: (inventory?.currentQuantity || 0) + returnItem.quantity,
            referenceId: sale.id,
            referenceType: 'SALE',
            unitPrice: saleItem.unitPrice,
            totalAmount: returnItem.quantity * saleItem.unitPrice,
            createdBy: returnData.returnedById,
          },
        });

        totalReturnAmount += returnItem.quantity * saleItem.unitPrice;
      }

      // Update sale status
      const updatedSale = await tx.sale.update({
        where: { id },
        data: {
          status: 'RETURNED',
          notes: sale.notes ? `${sale.notes}\nReturn: ${returnData.notes || ''}` : `Return: ${returnData.notes || ''}`,
        },
        include: {
          customer: true,
          branch: true,
          items: {
            include: {
              batch: {
                include: {
                  product: true,
                },
              },
            },
          },
          payments: true,
        },
      });

      // Update customer credit
      if (sale.customerId) {
        await tx.customer.update({
          where: { id: sale.customerId },
          data: {
            currentCredit: { decrement: totalReturnAmount },
          },
        });
      }

      return updatedSale;
    });
  }

  async getPayments(saleId) {
    const payments = await prisma.payment.findMany({
      where: {
        referenceType: 'SALE',
        referenceId: saleId,
      },
      include: {
        receivedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments;
  }

  async getAvailableBatches(productId) {
    const batches = await prisma.batch.findMany({
      where: {
        productId,
        status: { in: ['AVAILABLE', 'PARTIAL'] },
        remainingQuantity: { gt: 0 },
      },
      include: {
        product: true,
        inventory: {
          include: {
            branch: true,
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    return batches;
  }

  async delete(id) {
    const sale = await prisma.sale.findUnique({
      where: { id },
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    // Only allow deletion if no payments were made
    const payments = await prisma.payment.findMany({
      where: {
        referenceType: 'SALE',
        referenceId: id,
      },
    });

    if (payments.length > 0) {
      throw new AppError('Cannot delete sale with existing payments', 400);
    }

    // Delete sale items first
    await prisma.saleItem.deleteMany({
      where: { saleId: id },
    });

    await prisma.sale.delete({ where: { id } });
    return { success: true };
  }
}

export default new SaleService();