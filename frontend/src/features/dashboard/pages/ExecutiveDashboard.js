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

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
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

  const salesData = [
    { month: 'Jan', sales: 4000, revenue: 2400 },
    { month: 'Feb', sales: 3000, revenue: 1398 },
    { month: 'Mar', sales: 2000, revenue: 9800 },
    { month: 'Apr', sales: 2780, revenue: 3908 },
    { month: 'May', sales: 1890, revenue: 4800 },
    { month: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const inventoryData = [
    { name: 'Green Khat', value: 400 },
    { name: 'Yellow Khat', value: 300 },
    { name: 'Premium Khat', value: 200 },
    { name: 'Standard Khat', value: 150 },
  ];

  const branchPerformance = [
    { branch: 'HQ', sales: 12000, profit: 5000 },
    { branch: 'Branch A', sales: 8000, profit: 3000 },
    { branch: 'Branch B', sales: 6000, profit: 2000 },
    { branch: 'Warehouse', sales: 4000, profit: 1500 },
  ];

  const stats = [
    { 
      title: t('totalRevenue'), 
      value: ',500', 
      icon: DollarSign, 
      color: 'green',
      trend: 'up',
      trendValue: '12.5%',
      subtitle: t('thisMonth')
    },
    { 
      title: t('totalSales'), 
      value: '2,345', 
      icon: ShoppingCart, 
      color: 'blue',
      trend: 'up',
      trendValue: '8.3%',
      subtitle: t('thisMonth')
    },
    { 
      title: t('totalProducts'), 
      value: '1,234', 
      icon: Package, 
      color: 'purple',
      trend: 'up',
      trendValue: '5.2%',
      subtitle: t('inStock')
    },
    { 
      title: t('activeUsers'), 
      value: '56', 
      icon: Users, 
      color: 'orange',
      trend: 'down',
      trendValue: '2.1%',
      subtitle: t('onlineNow') + ': 12'
    }
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
            { key: 'sales', name: t('sales.title') },
            { key: 'revenue', name: t('revenue') }
          ]}
          xAxisKey="month"
        />
        <ChartWidget
          title={t('branchPerformance')}
          data={branchPerformance}
          type="bar"
          series={[
            { key: 'sales', name: t('sales.title') },
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
              { key: 'sales', name: t('sales.title') },
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


