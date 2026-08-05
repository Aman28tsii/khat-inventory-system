import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(2, 'SKU is required'),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().default('KG'),
  minStockQuantity: z.number().min(0).default(0).optional(),
  maxStockQuantity: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
});