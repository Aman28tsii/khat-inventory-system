import { z } from 'zod';

export const createCustomerSchema = z.object({
  code: z.string().min(2, 'Customer code is required'),
  name: z.string().min(2, 'Customer name is required'),
  type: z.enum(['INDIVIDUAL', 'BUSINESS', 'WHOLESALE', 'RETAIL']).default('INDIVIDUAL'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  address: z.string().optional(),
  taxId: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  paymentTerms: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerIdSchema = z.object({
  id: z.string().uuid('Invalid customer ID'),
});