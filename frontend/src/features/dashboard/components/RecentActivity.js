import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  DollarSign,
  ArrowRightLeft,
  Clock
} from 'lucide-react';

const activityIcons = {
  sale: ShoppingCart,
  purchase: Package,
  transfer: ArrowRightLeft,
  user: Users,
  payment: DollarSign,
  inventory: Package,
  default: Clock
};

const activityColors = {
  sale: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purchase: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  transfer: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  user: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  payment: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  inventory: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
};

const RecentActivity = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type] || activityIcons.default;
          const color = activityColors[activity.type] || activityColors.default;
          
          return (
            <motion.div
              key={activity.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {activity.time || 'Just now'}
                </p>
              </div>
              {activity.amount && (
                <div className="text-sm font-medium text-gray-900 dark:text-white flex-shrink-0">
                  ${activity.amount.toFixed(2)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;

