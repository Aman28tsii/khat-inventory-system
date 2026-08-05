import { z } from 'zod';

export const createBatchSchema = z.object({
  batchNumber: z.string().min(2, 'Batch number is required'),
  productId: z.string().uuid('Invalid product ID'),
  supplierId: z.string().uuid('Invalid supplier ID').optional(),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  sellingPrice: z.number().min(0).optional(),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  arrivalDate: z.string().datetime().optional(),
  harvestDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  grade: z.string().optional(),
  moisturePercentage: z.number().min(0).max(100).optional(),
  freshnessScore: z.number().min(0).max(100).optional(),
  leafDensity: z.string().optional(),
  stemRatio: z.number().min(0).max(100).optional(),
  qualityNotes: z.string().optional(),
  status: z.enum(['AVAILABLE', 'PARTIAL', 'EXPIRED', 'QUARANTINED', 'DISPOSED']).default('AVAILABLE'),
});

export const updateBatchSchema = createBatchSchema.partial();

export const batchIdSchema = z.object({
  id: z.string().uuid('Invalid batch ID'),
});

export const qualityInspectionSchema = z.object({
  grade: z.string().optional(),
  moisturePercentage: z.number().min(0).max(100).optional(),
  freshnessScore: z.number().min(0).max(100).optional(),
  leafDensity: z.string().optional(),
  stemRatio: z.number().min(0).max(100).optional(),
  inspectionDate: z.string().datetime().optional(),
  qualityNotes: z.string().optional(),
  isQualityChecked: z.boolean().default(true),
});