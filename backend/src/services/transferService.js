import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

class TransferService {
  async getAll(filters = {}) {
    const { search, status, fromBranchId, toBranchId, page = 1, limit = 10 } = filters;

    const where = {};

    if (search) {
      where.OR = [
        { transferNumber: { contains: search, mode: 'insensitive' } },
        { fromBranch: { name: { contains: search, mode: 'insensitive' } } },
        { toBranch: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (fromBranchId) {
      where.fromBranchId = fromBranchId;
    }

    if (toBranchId) {
      where.toBranchId = toBranchId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        include: {
          fromBranch: true,
          toBranch: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          receivedBy: {
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
      prisma.transfer.count({ where }),
    ]);

    return { data: transfers, total };
  }

  async getById(id) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        fromBranch: true,
        toBranch: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        receivedBy: {
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
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    return transfer;
  }

  async create(data) {
    // Validate branches
    if (data.fromBranchId === data.toBranchId) {
      throw new AppError('Source and destination branches must be different', 400);
    }

    const fromBranch = await prisma.branch.findUnique({
      where: { id: data.fromBranchId },
    });

    if (!fromBranch) {
      throw new AppError('Source branch not found', 404);
    }

    const toBranch = await prisma.branch.findUnique({
      where: { id: data.toBranchId },
    });

    if (!toBranch) {
      throw new AppError('Destination branch not found', 404);
    }

    // Generate transfer number
    const count = await prisma.transfer.count();
    const transferNumber = `TF-${String(count + 1).padStart(6, '0')}`;

    // Validate batches and quantities
    for (const item of data.items) {
      const batch = await prisma.batch.findUnique({
        where: { id: item.batchId },
        include: {
          inventory: {
            where: { branchId: data.fromBranchId },
          },
        },
      });

      if (!batch) {
        throw new AppError(`Batch with ID ${item.batchId} not found`, 404);
      }

      const inventory = batch.inventory[0];
      if (!inventory || inventory.availableQuantity < item.quantity) {
        throw new AppError(`Insufficient quantity for batch ${batch.batchNumber} at source branch`, 400);
      }
    }

    return prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.create({
        data: {
          transferNumber,
          fromBranchId: data.fromBranchId,
          toBranchId: data.toBranchId,
          transferDate: data.transferDate ? new Date(data.transferDate) : new Date(),
          expectedArrival: data.expectedArrival ? new Date(data.expectedArrival) : null,
          notes: data.notes,
          status: 'PENDING',
          createdById: data.createdById,
        },
      });

      // Create transfer items and update inventory
      for (const item of data.items) {
        await tx.transferItem.create({
          data: {
            transferId: transfer.id,
            batchId: item.batchId,
            quantity: item.quantity,
            notes: item.notes,
          },
        });

        // Reserve quantity at source branch
        const inventory = await tx.inventory.findFirst({
          where: {
            batchId: item.batchId,
            branchId: data.fromBranchId,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              reservedQuantity: { increment: item.quantity },
              availableQuantity: { decrement: item.quantity },
            },
          });
        }

        // Create stock movement for reservation
        await tx.stockMovement.create({
          data: {
            batchId: item.batchId,
            branchId: data.fromBranchId,
            productId: (await tx.batch.findUnique({ where: { id: item.batchId } })).productId,
            movementType: 'TRANSFER_OUT',
            quantity: item.quantity,
            previousQuantity: inventory?.availableQuantity || 0,
            newQuantity: (inventory?.availableQuantity || 0) - item.quantity,
            referenceId: transfer.id,
            referenceType: 'TRANSFER',
            createdBy: data.createdById,
          },
        });
      }

      return transfer;
    });
  }

  async update(id, data) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    // Only allow updates if status is PENDING
    if (transfer.status !== 'PENDING') {
      throw new AppError('Only pending transfers can be updated', 400);
    }

    return prisma.transfer.update({
      where: { id },
      data: {
        ...data,
        expectedArrival: data.expectedArrival ? new Date(data.expectedArrival) : undefined,
      },
      include: {
        fromBranch: true,
        toBranch: true,
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
    });
  }

  async approve(id, approvedById) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    if (transfer.status !== 'PENDING') {
      throw new AppError('Only pending transfers can be approved', 400);
    }

    return prisma.transfer.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById,
        approvedAt: new Date(),
      },
      include: {
        fromBranch: true,
        toBranch: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        approvedBy: {
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
    });
  }

  async reject(id, data, rejectedById) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    if (transfer.status !== 'PENDING') {
      throw new AppError('Only pending transfers can be rejected', 400);
    }

    return prisma.$transaction(async (tx) => {
      // Release reserved quantities
      for (const item of transfer.items) {
        const inventory = await tx.inventory.findFirst({
          where: {
            batchId: item.batchId,
            branchId: transfer.fromBranchId,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              reservedQuantity: { decrement: item.quantity },
              availableQuantity: { increment: item.quantity },
            },
          });
        }
      }

      const updatedTransfer = await tx.transfer.update({
        where: { id },
        data: {
          status: 'REJECTED',
          notes: transfer.notes ? `${transfer.notes}\nRejected: ${data.notes || ''}` : `Rejected: ${data.notes || ''}`,
        },
        include: {
          fromBranch: true,
          toBranch: true,
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
      });

      return updatedTransfer;
    });
  }

  async receive(id, receiveData, receivedById) {
    const transfer = await prisma.transfer.findUnique({
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
        fromBranch: true,
        toBranch: true,
      },
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    if (transfer.status !== 'APPROVED' && transfer.status !== 'IN_TRANSIT') {
      throw new AppError('Only approved transfers can be received', 400);
    }

    return prisma.$transaction(async (tx) => {
      for (const receiveItem of receiveData.items) {
        const transferItem = transfer.items.find(
          (item) => item.id === receiveItem.transferItemId
        );

        if (!transferItem) {
          throw new AppError(`Transfer item ${receiveItem.transferItemId} not found`, 404);
        }

        if (receiveItem.receivedQuantity > transferItem.quantity) {
          throw new AppError(`Received quantity exceeds transfer quantity for batch ${transferItem.batch.batchNumber}`, 400);
        }

        // Update transfer item received quantity
        await tx.transferItem.update({
          where: { id: transferItem.id },
          data: {
            receivedQuantity: receiveItem.receivedQuantity,
            notes: receiveItem.notes,
          },
        });

        // Remove reservation from source
        const sourceInventory = await tx.inventory.findFirst({
          where: {
            batchId: transferItem.batchId,
            branchId: transfer.fromBranchId,
          },
        });

        if (sourceInventory) {
          await tx.inventory.update({
            where: { id: sourceInventory.id },
            data: {
              currentQuantity: { decrement: transferItem.quantity },
              reservedQuantity: { decrement: transferItem.quantity },
            },
          });
        }

        // Add to destination branch
        let destInventory = await tx.inventory.findFirst({
          where: {
            batchId: transferItem.batchId,
            branchId: transfer.toBranchId,
          },
        });

        if (destInventory) {
          await tx.inventory.update({
            where: { id: destInventory.id },
            data: {
              currentQuantity: { increment: receiveItem.receivedQuantity },
              availableQuantity: { increment: receiveItem.receivedQuantity },
            },
          });
        } else {
          // Create new inventory at destination
          await tx.inventory.create({
            data: {
              batchId: transferItem.batchId,
              branchId: transfer.toBranchId,
              currentQuantity: receiveItem.receivedQuantity,
              availableQuantity: receiveItem.receivedQuantity,
            },
          });
        }

        // Create stock movements
        // Out movement
        await tx.stockMovement.create({
          data: {
            batchId: transferItem.batchId,
            branchId: transfer.fromBranchId,
            productId: transferItem.batch.productId,
            movementType: 'TRANSFER_OUT',
            quantity: transferItem.quantity,
            previousQuantity: sourceInventory?.currentQuantity || 0,
            newQuantity: (sourceInventory?.currentQuantity || 0) - transferItem.quantity,
            referenceId: transfer.id,
            referenceType: 'TRANSFER',
            createdBy: receivedById,
          },
        });

        // In movement
        await tx.stockMovement.create({
          data: {
            batchId: transferItem.batchId,
            branchId: transfer.toBranchId,
            productId: transferItem.batch.productId,
            movementType: 'TRANSFER_IN',
            quantity: receiveItem.receivedQuantity,
            previousQuantity: destInventory?.currentQuantity || 0,
            newQuantity: (destInventory?.currentQuantity || 0) + receiveItem.receivedQuantity,
            referenceId: transfer.id,
            referenceType: 'TRANSFER',
            createdBy: receivedById,
          },
        });

        // Update batch status if remaining quantity is 0
        const batch = await tx.batch.findUnique({
          where: { id: transferItem.batchId },
        });

        if (batch && batch.remainingQuantity <= 0) {
          await tx.batch.update({
            where: { id: transferItem.batchId },
            data: { status: 'PARTIAL' },
          });
        }
      }

      const updatedTransfer = await tx.transfer.update({
        where: { id },
        data: {
          status: 'RECEIVED',
          receivedById,
          receivedAt: new Date(),
          actualArrival: new Date(),
        },
        include: {
          fromBranch: true,
          toBranch: true,
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          receivedBy: {
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
      });

      return updatedTransfer;
    });
  }

  async getItems(transferId) {
    const items = await prisma.transferItem.findMany({
      where: { transferId },
      include: {
        batch: {
          include: {
            product: true,
          },
        },
      },
    });

    return items;
  }

  async getAvailableBatches(branchId) {
    const inventory = await prisma.inventory.findMany({
      where: {
        branchId,
        availableQuantity: { gt: 0 },
      },
      include: {
        batch: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        batch: {
          expiryDate: 'asc',
        },
      },
    });

    return inventory.map((item) => ({
      ...item.batch,
      availableQuantity: item.availableQuantity,
      inventoryId: item.id,
    }));
  }

  async delete(id) {
    const transfer = await prisma.transfer.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!transfer) {
      throw new AppError('Transfer not found', 404);
    }

    // Only allow deletion of pending transfers
    if (transfer.status !== 'PENDING') {
      throw new AppError('Only pending transfers can be deleted', 400);
    }

    // Release reserved quantities
    for (const item of transfer.items) {
      const inventory = await prisma.inventory.findFirst({
        where: {
          batchId: item.batchId,
          branchId: transfer.fromBranchId,
        },
      });

      if (inventory) {
        await prisma.inventory.update({
          where: { id: inventory.id },
          data: {
            reservedQuantity: { decrement: item.quantity },
            availableQuantity: { increment: item.quantity },
          },
        });
      }
    }

    // Delete transfer items
    await prisma.transferItem.deleteMany({
      where: { transferId: id },
    });

    await prisma.transfer.delete({ where: { id } });
    return { success: true };
  }
}

export default new TransferService();