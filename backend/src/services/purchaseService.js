import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class PurchaseService {
  async getAll(filters = {}) {
    const { search, status, supplierId, branchId, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { purchaseNumber: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where,
        include: {
          supplier: true,
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
              product: true,
              batch: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.purchase.count({ where }),
    ]);

    return { data: purchases, total };
  }

  async getById(id) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
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
            product: true,
            batch: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    return purchase;
  }

  async create(data) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });

    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }

    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
    });

    if (!branch) {
      throw new AppError('Branch not found', 404);
    }

    // Generate purchase number
    const count = await prisma.purchase.count();
    const purchaseNumber = `PO-${String(count + 1).padStart(6, '0')}`;

    // Calculate totals
    let subtotal = 0;
    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      subtotal += item.quantity * item.unitPrice;
    }

    return prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          purchaseNumber,
          supplierId: data.supplierId,
          branchId: data.branchId,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
          expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
          notes: data.notes,
          subtotal,
          tax: 0,
          discount: 0,
          totalAmount: subtotal,
          status: 'DRAFT',
          createdById: data.createdById,
        },
      });

      // Create purchase items
      for (const item of data.items) {
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes,
          },
        });
      }

      return purchase;
    });
  }

  async update(id, data) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    // Prevent update if status is RECEIVED or CANCELLED
    if (purchase.status === 'RECEIVED' || purchase.status === 'CANCELLED') {
      throw new AppError('Cannot update a received or cancelled purchase', 400);
    }

    return prisma.purchase.update({
      where: { id },
      data: {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : undefined,
      },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            product: true,
            batch: true,
          },
        },
      },
    });
  }

  async receive(id, receiveData) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        branch: true,
        supplier: true,
      },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    // Check if already received
    if (purchase.status === 'RECEIVED') {
      throw new AppError('Purchase already received', 400);
    }

    return prisma.$transaction(async (tx) => {
      let allReceived = true;
      let partialReceived = false;

      for (const receiveItem of receiveData.items) {
        const purchaseItem = purchase.items.find(
          (item) => item.id === receiveItem.purchaseItemId
        );

        if (!purchaseItem) {
          throw new AppError(`Purchase item ${receiveItem.purchaseItemId} not found`, 404);
        }

        // Update received quantity
        const newReceivedQuantity = purchaseItem.receivedQuantity + receiveItem.receivedQuantity;
        
        if (newReceivedQuantity > purchaseItem.quantity) {
          throw new AppError(
            `Received quantity exceeds ordered quantity for item ${purchaseItem.product.name}`,
            400
          );
        }

        await tx.purchaseItem.update({
          where: { id: purchaseItem.id },
          data: { receivedQuantity: newReceivedQuantity },
        });

        // Create batch if receiving items
        const batchNumber = receiveItem.batchNumber || `BATCH-${purchase.purchaseNumber}-${purchaseItem.product.sku}`;
        
        const batch = await tx.batch.create({
          data: {
            batchNumber,
            productId: purchaseItem.productId,
            supplierId: purchase.supplierId,
            purchaseOrderId: purchase.id,
            purchasePrice: purchaseItem.unitPrice,
            quantity: receiveItem.receivedQuantity,
            remainingQuantity: receiveItem.receivedQuantity,
            arrivalDate: new Date(),
            expiryDate: receiveItem.expiryDate ? new Date(receiveItem.expiryDate) : null,
            status: 'AVAILABLE',
          },
        });

        // Create inventory record
        const existingInventory = await tx.inventory.findFirst({
          where: {
            batchId: batch.id,
            branchId: purchase.branchId,
          },
        });

        if (existingInventory) {
          await tx.inventory.update({
            where: { id: existingInventory.id },
            data: {
              currentQuantity: { increment: receiveItem.receivedQuantity },
              availableQuantity: { increment: receiveItem.receivedQuantity },
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              batchId: batch.id,
              branchId: purchase.branchId,
              currentQuantity: receiveItem.receivedQuantity,
              availableQuantity: receiveItem.receivedQuantity,
            },
          });
        }

        // Create stock movement
        await tx.stockMovement.create({
          data: {
            batchId: batch.id,
            branchId: purchase.branchId,
            productId: purchaseItem.productId,
            movementType: 'PURCHASE',
            quantity: receiveItem.receivedQuantity,
            previousQuantity: 0,
            newQuantity: receiveItem.receivedQuantity,
            referenceId: purchase.id,
            referenceType: 'PURCHASE',
            unitPrice: purchaseItem.unitPrice,
            totalAmount: receiveItem.receivedQuantity * purchaseItem.unitPrice,
            createdBy: receiveData.receivedById,
          },
        });

        // Update batch with purchase item
        await tx.purchaseItem.update({
          where: { id: purchaseItem.id },
          data: { batchId: batch.id },
        });

        // Check receive status
        if (newReceivedQuantity < purchaseItem.quantity) {
          allReceived = false;
          partialReceived = true;
        }
      }

      // Update purchase status
      let newStatus = 'RECEIVED';
      if (partialReceived && !allReceived) {
        newStatus = 'PARTIAL';
      } else if (!partialReceived && !allReceived) {
        newStatus = 'ORDERED';
      }

      const updatedPurchase = await tx.purchase.update({
        where: { id },
        data: {
          status: newStatus,
          actualDelivery: new Date(),
        },
        include: {
          supplier: true,
          branch: true,
          items: {
            include: {
              product: true,
              batch: true,
            },
          },
        },
      });

      return updatedPurchase;
    });
  }

  async approve(id, approvedById) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    if (purchase.status !== 'DRAFT') {
      throw new AppError('Only draft purchases can be approved', 400);
    }

    return prisma.purchase.update({
      where: { id },
      data: {
        status: 'ORDERED',
      },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async reject(id, data) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    if (purchase.status !== 'DRAFT') {
      throw new AppError('Only draft purchases can be rejected', 400);
    }

    return prisma.purchase.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: data.notes ? `${purchase.notes || ''}\nRejected: ${data.notes}` : purchase.notes,
      },
      include: {
        supplier: true,
        branch: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async delete(id) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    // Only allow deletion of draft purchases
    if (purchase.status !== 'DRAFT') {
      throw new AppError('Only draft purchases can be deleted', 400);
    }

    // Delete all items first
    await prisma.purchaseItem.deleteMany({
      where: { purchaseId: id },
    });

    await prisma.purchase.delete({ where: { id } });
    return { success: true };
  }

  async getItems(purchaseId) {
    const items = await prisma.purchaseItem.findMany({
      where: { purchaseId },
      include: {
        product: true,
        batch: true,
      },
    });

    return items;
  }

  async addItem(purchaseId, data) {
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new AppError('Purchase not found', 404);
    }

    if (purchase.status !== 'DRAFT') {
      throw new AppError('Cannot add items to non-draft purchase', 400);
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return prisma.purchaseItem.create({
      data: {
        purchaseId,
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalPrice: data.quantity * data.unitPrice,
        notes: data.notes,
      },
      include: {
        product: true,
      },
    });
  }

  async removeItem(itemId) {
    const item = await prisma.purchaseItem.findUnique({
      where: { id: itemId },
      include: {
        purchase: true,
      },
    });

    if (!item) {
      throw new AppError('Purchase item not found', 404);
    }

    if (item.purchase.status !== 'DRAFT') {
      throw new AppError('Cannot remove items from non-draft purchase', 400);
    }

    await prisma.purchaseItem.delete({ where: { id: itemId } });
    return { success: true };
  }
}

export default new PurchaseService();