import { z } from 'zod';

export const createSupplierSchema = z.object({
  code: z.string().min(2, 'Supplier code is required'),
  name: z.string().min(2, 'Supplier name is required'),
  contactPerson: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const supplierIdSchema = z.object({
  id: z.string().uuid('Invalid supplier ID'),
});