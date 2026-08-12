import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { createUser, updateUser } from '../slices/usersSlice';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  employeeId: z.string().min(3, 'Employee ID is required'),
  roleId: z.string().uuid('Role is required'),
  branchId: z.string().uuid('Branch is required').optional(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number')
    .optional(),
});

const UserForm = ({ user, isEditing, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { roles } = useSelector((state) => state.roles || { roles: [] });
  const { branches } = useSelector((state) => state.branches || { branches: [] });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
      roleId: '',
      branchId: '',
      phone: '',
      password: '',
    }
  });

  useEffect(() => {
    if (user && isEditing) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        employeeId: user.employeeId,
        roleId: user.roleId,
        branchId: user.branchId || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user, isEditing, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        // Remove password if empty
        if (!data.password) delete data.password;
        await dispatch(updateUser({ id: user.id, data })).unwrap();
      } else {
        await dispatch(createUser(data)).unwrap();
      }
      onSuccess();
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          error={errors.firstName?.message}
          {...register('firstName')}
          disabled={isLoading}
        />
        <Input
          label="Last Name"
          error={errors.lastName?.message}
          {...register('lastName')}
          disabled={isLoading}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        error={errors.email?.message}
        {...register('email')}
        disabled={isLoading || isEditing}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Employee ID"
          error={errors.employeeId?.message}
          {...register('employeeId')}
          disabled={isLoading || isEditing}
        />
        <Input
          label="Phone Number"
          error={errors.phone?.message}
          {...register('phone')}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register('roleId')}
            disabled={isLoading}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600">{errors.roleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Branch
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            {...register('branchId')}
            disabled={isLoading}
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          {errors.branchId && (
            <p className="mt-1 text-sm text-red-600">{errors.branchId.message}</p>
          )}
        </div>
      </div>

      {!isEditing && (
        <Input
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register('password')}
          disabled={isLoading}
          helper="Must be at least 8 characters with uppercase, lowercase and number"
        />
      )}

      {isEditing && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Leave password empty to keep current password
          </p>
          <Input
            label="New Password (Optional)"
            type="password"
            error={errors.password?.message}
            {...register('password')}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;


