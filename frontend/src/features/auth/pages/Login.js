import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, clearError } from '../slices/authSlice';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { useLanguage } from '../../../context/LanguageContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const Login = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      // Error handled by redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-8 border border-secondary-200 dark:border-secondary-700">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl mb-4">
              <span className="text-4xl">🌿</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              {t('appName')}
            </h1>
            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
              {t('loginTitle')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t('email')}
              type="email"
              placeholder="admin@khattrading.com"
              icon={<Mail className="w-4 h-4 text-secondary-400" />}
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email')}
            />

            <Input
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={t('password')}
              icon={<Lock className="w-4 h-4 text-secondary-400" />}
              error={errors.password?.message}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
                  {t('rememberMe')}
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              {t('defaultAdmin')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

