import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

const alertIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  info: Info,
  default: AlertCircle
};

const alertColors = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  default: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400'
};

const AlertsList = ({ alerts = [] }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alerts</h3>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">All systems operating normally</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">No alerts to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alerts</h3>
        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type] || alertIcons.default;
          const color = alertColors[alert.type] || alertColors.default;
          
          return (
            <motion.div
              key={alert.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border rounded-lg ${color}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-sm opacity-90">{alert.message}</p>
                  {alert.time && (
                    <p className="text-xs opacity-70 mt-1">{alert.time}</p>
                  )}
                </div>
                {alert.action && (
                  <button className="text-sm font-medium hover:underline flex-shrink-0">
                    {alert.action}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsList;
