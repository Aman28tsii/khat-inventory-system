import { z } from 'zod';

export const createPurchaseSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
  branchId: z.string().uuid('Invalid branch ID'),
  purchaseDate: z.string().datetime().optional(),
  expectedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
      unitPrice: z.number().min(0, 'Unit price must be positive'),
      notes: z.string().optional(),
    })
  ).min(1, 'At least one item is required'),
});

export const updatePurchaseSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID').optional(),
  branchId: z.string().uuid('Invalid branch ID').optional(),
  purchaseDate: z.string().datetime().optional(),
  expectedDelivery: z.string().datetime().optional(),
  notes: z.string().optional(),
  status: z.enum(['DRAFT', 'ORDERED', 'RECEIVED', 'PARTIAL', 'RETURNED', 'CANCELLED']).optional(),
});

export const receivePurchaseSchema = z.object({
  items: z.array(
    z.object({
      purchaseItemId: z.string().uuid('Invalid purchase item ID'),
      receivedQuantity: z.number().min(0.01, 'Received quantity must be greater than 0'),
      batchNumber: z.string().optional(),
      expiryDate: z.string().datetime().optional(),
    })
  ),
});

export const purchaseIdSchema = z.object({
  id: z.string().uuid('Invalid purchase ID'),
});

export const purchaseItemIdSchema = z.object({
  itemId: z.string().uuid('Invalid purchase item ID'),
});