import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { register as registerUser, clearError } from '../slices/authSlice';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useLanguage } from '../../../context/LanguageContext';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Register = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })).unwrap();
      navigate('/login');
    } catch (error) {
      // Error handled by redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8 border border-secondary-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
              <span className="text-4xl">🌿</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              {t('auth.register')}
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
              {t('auth.register')}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('users.firstName')}
                placeholder="John"
                icon={<User className="w-4 h-4 text-secondary-400" />}
                error={errors.firstName?.message}
                disabled={isLoading}
                {...register('firstName')}
              />
              <Input
                label={t('users.lastName')}
                placeholder="Doe"
                icon={<User className="w-4 h-4 text-secondary-400" />}
                error={errors.lastName?.message}
                disabled={isLoading}
                {...register('lastName')}
              />
            </div>

            <Input
              label={t('auth.email')}
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="w-4 h-4 text-secondary-400" />}
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email')}
            />

            <Input
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.password')}
              icon={<Lock className="w-4 h-4 text-secondary-400" />}
              error={errors.password?.message}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <Input
              label={t('auth.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('auth.confirmPassword')}
              icon={<Lock className="w-4 h-4 text-secondary-400" />}
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? t('common.loading') : t('auth.register')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {t('auth.login')}{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

