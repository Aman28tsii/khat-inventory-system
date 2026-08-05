import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  employeeId: z.string().min(3, 'Employee ID is required'),
  roleId: z.string().uuid('Invalid role ID'),
  branchId: z.string().uuid('Invalid branch ID').optional(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  roleId: z.string().uuid('Invalid role ID').optional(),
  branchId: z.string().uuid('Invalid branch ID').optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).optional(),
});

export const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export const updateUserRoleSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
});