import { z } from 'zod';

export const createTransferSchema = z.object({
  fromBranchId: z.string().uuid('Invalid source branch ID'),
  toBranchId: z.string().uuid('Invalid destination branch ID'),
  transferDate: z.string().datetime().optional(),
  expectedArrival: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      batchId: z.string().uuid('Invalid batch ID'),
      quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
      notes: z.string().optional(),
    })
  ).min(1, 'At least one item is required'),
});

export const updateTransferSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'REJECTED', 'CANCELLED']).optional(),
  expectedArrival: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const rejectTransferSchema = z.object({
  notes: z.string().optional(),
});

export const receiveTransferSchema = z.object({
  items: z.array(
    z.object({
      transferItemId: z.string().uuid('Invalid transfer item ID'),
      receivedQuantity: z.number().min(0.01, 'Received quantity must be greater than 0'),
      notes: z.string().optional(),
    })
  ),
  notes: z.string().optional(),
});

export const transferIdSchema = z.object({
  id: z.string().uuid('Invalid transfer ID'),
});