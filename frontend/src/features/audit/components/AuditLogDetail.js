import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Clock, 
  Globe, 
  Monitor,
  FileText,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Button from '../../../components/common/Button/Button';

const AuditLogDetail = ({ log, onClose }) => {
  if (!log) return null;

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'text-green-600 dark:text-green-400',
      UPDATE: 'text-blue-600 dark:text-blue-400',
      DELETE: 'text-red-600 dark:text-red-400',
      LOGIN: 'text-purple-600 dark:text-purple-400',
      LOGOUT: 'text-purple-600 dark:text-purple-400',
      VIEW: 'text-gray-600 dark:text-gray-400',
      EXPORT: 'text-orange-600 dark:text-orange-400',
      default: 'text-gray-600 dark:text-gray-400'
    };
    return colors[action] || colors.default;
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      LOGIN: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      LOGOUT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      VIEW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      EXPORT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[action] || colors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionBadgeColor(log.action)}`}>
              {log.action}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {log.resourceType}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">
            {log.resourceType} {log.action.toLowerCase()} by {log.user?.firstName} {log.user?.lastName}
          </h3>
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">User:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {log.user?.firstName} {log.user?.lastName}
            </span>
            <span className="text-gray-400">({log.user?.email})</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Time:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(log.createdAt).toLocaleString()}
            </span>
            <span className="text-gray-400">
              ({formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })})
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              {log.ipAddress || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Device:</span>
            <span className="text-gray-900 dark:text-white text-sm truncate max-w-xs">
              {log.userAgent || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Resource ID:</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              {log.resourceId || 'N/A'}
            </span>
          </div>
        </div>

        {/* Changes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Changes
          </h4>
          {log.changes && Object.keys(log.changes).length > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(log.changes).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium min-w-24">
                    {key}:
                  </span>
                  <div className="flex-1">
                    {typeof value === 'object' ? (
                      <pre className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-2 rounded">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-gray-900 dark:text-white break-all">
                        {String(value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No changes recorded</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogDetail;