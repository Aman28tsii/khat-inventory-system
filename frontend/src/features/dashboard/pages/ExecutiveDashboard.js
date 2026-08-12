import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatsCard from '../components/StatsCard';
import ChartWidget from '../components/ChartWidget';
import RecentActivity from '../components/RecentActivity';
import AlertsList from '../components/AlertsList';
import Button from '../../../components/common/Button/Button';
import { fetchExecutiveDashboard, fetchRecentActivities, fetchAlerts, clearError } from '../slices/dashboardSlice';
import { useLanguage } from '../../../context/LanguageContext';

const ExecutiveDashboard = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const executive = useSelector((state) => state.dashboard?.executive);
  const recentActivities = useSelector((state) => state.dashboard?.recentActivities || []);
  const alerts = useSelector((state) => state.dashboard?.alerts || []);
  const isLoading = useSelector((state) => state.dashboard?.isLoading || false);
  const error = useSelector((state) => state.dashboard?.error || null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '.00';
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Format number
  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return Number(num).toLocaleString('en-US');
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || t('errors.generic'));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchExecutiveDashboard()).unwrap(),
        dispatch(fetchRecentActivities()).unwrap(),
        dispatch(fetchAlerts()).unwrap()
      ]);
    } catch (error) {
      // Error handled by redux
    } finally {
      setIsRefreshing(false);
    }
  };

  // Use executive data from API - match the actual response structure
  const data = executive?.data || executive || {};

  // Extract stats from the response
  const statsData = data.stats || {};

  // Stats cards with data from API
  const stats = [
    { 
      title: t('totalRevenue'), 
      value: formatCurrency(statsData.totalRevenue || statsData.revenue || 0), 
      icon: DollarSign, 
      color: 'green',
      trend: statsData.revenueTrend || 'up',
      trendValue: statsData.revenueTrendValue || '0%',
      subtitle: t('thisMonth')
    },
    { 
      title: t('totalSales'), 
      value: formatNumber(statsData.totalSales || statsData.sales || 0), 
      icon: ShoppingCart, 
      color: 'blue',
      trend: statsData.salesTrend || 'up',
      trendValue: statsData.salesTrendValue || '0%',
      subtitle: t('thisMonth')
    },
    { 
      title: t('totalProducts'), 
      value: formatNumber(statsData.totalProducts || statsData.products || 0), 
      icon: Package, 
      color: 'purple',
      trend: statsData.productsTrend || 'up',
      trendValue: statsData.productsTrendValue || '0%',
      subtitle: t('inStock')
    },
    { 
      title: t('activeUsers'), 
      value: formatNumber(statsData.activeUsers || statsData.users || 0), 
      icon: Users, 
      color: 'orange',
      trend: statsData.usersTrend || 'down',
      trendValue: statsData.usersTrendValue || '0%',
      subtitle: t('onlineNow') + ': ' + (statsData.onlineUsers || 0)
    }
  ];

  // Chart data from API or fallback to empty
  const salesData = data.salesChart || [
    { month: 'Jan', sales: 0, revenue: 0 },
    { month: 'Feb', sales: 0, revenue: 0 },
    { month: 'Mar', sales: 0, revenue: 0 },
    { month: 'Apr', sales: 0, revenue: 0 },
    { month: 'May', sales: 0, revenue: 0 },
    { month: 'Jun', sales: 0, revenue: 0 },
  ];

  const branchPerformance = data.branchPerformance || [
    { branch: 'HQ', sales: 0, profit: 0 },
    { branch: 'Branch A', sales: 0, profit: 0 },
    { branch: 'Branch B', sales: 0, profit: 0 },
    { branch: 'Warehouse', sales: 0, profit: 0 },
  ];

  const inventoryData = data.inventoryDistribution || [
    { name: 'Green Khat', value: 0 },
    { name: 'Yellow Khat', value: 0 },
    { name: 'Premium Khat', value: 0 },
    { name: 'Standard Khat', value: 0 },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🌿 {t('executive')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('overview')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('lastUpdated')}: {new Date().toLocaleTimeString()}
          </span>
          <Button 
            variant="secondary" 
            size="sm"
            isLoading={isRefreshing}
            onClick={loadDashboardData}
          >
            <RefreshCw className={'w-4 h-4 mr-2 ' + (isRefreshing ? 'animate-spin' : '')} />
            {t('refresh')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          title={t('salesTrend')}
          data={salesData}
          type="line"
          series={[
            { key: 'sales', name: t('sales') },
            { key: 'revenue', name: t('revenue') }
          ]}
          xAxisKey="month"
        />
        <ChartWidget
          title={t('branchPerformance')}
          data={branchPerformance}
          type="bar"
          series={[
            { key: 'sales', name: t('sales') },
            { key: 'profit', name: t('profit') }
          ]}
          xAxisKey="branch"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartWidget
            title={t('inventoryDistribution')}
            data={inventoryData}
            type="pie"
            dataKey="value"
            xAxisKey="name"
            height={300}
          />
        </div>
        <div className="lg:col-span-2">
          <ChartWidget
            title={t('monthlyPerformance')}
            data={salesData}
            type="area"
            series={[
              { key: 'sales', name: t('sales') },
              { key: 'revenue', name: t('revenue') }
            ]}
            xAxisKey="month"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} />
        <AlertsList alerts={alerts} />
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
