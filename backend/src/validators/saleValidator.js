import { z } from 'zod';

export const createSaleSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID').optional(),
  branchId: z.string().uuid('Invalid branch ID'),
  saleDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      batchId: z.string().uuid('Invalid batch ID'),
      quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
      unitPrice: z.number().min(0, 'Unit price must be positive'),
      discount: z.number().min(0).default(0).optional(),
      notes: z.string().optional(),
    })
  ).min(1, 'At least one item is required'),
});

export const updateSaleSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID').optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED', 'RETURNED']).optional(),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Payment amount must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHEQUE', 'ONLINE']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const returnSaleSchema = z.object({
  items: z.array(
    z.object({
      saleItemId: z.string().uuid('Invalid sale item ID'),
      quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
      reason: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

export const saleIdSchema = z.object({
  id: z.string().uuid('Invalid sale ID'),
});