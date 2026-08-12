import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Package,
  ShoppingCart,
  Truck,
  Users,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../slices/notificationSlice';
import Button from '../../../components/common/Button/Button';

const iconMap = {
  inventory: Package,
  sales: ShoppingCart,
  purchases: Truck,
  transfers: Truck,
  users: Users,
  payment: DollarSign,
  warning: AlertCircle,
  default: Bell
};

const colorMap = {
  inventory: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  sales: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purchases: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  transfers: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  users: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  payment: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  warning: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
};

const NotificationDropdown = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ limit: 10 }));
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id));
    }
    if (notification.actionUrl) {
      onClose();
      navigate(notification.actionUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.slice(0, 10).map((notification) => {
              const Icon = iconMap[notification.type] || iconMap.default;
              const color = colorMap[notification.type] || colorMap.default;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''} text-gray-900 dark:text-white`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleViewAll}
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

