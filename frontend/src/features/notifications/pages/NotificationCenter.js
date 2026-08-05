import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2,
  Filter,
  Search,
  Package,
  ShoppingCart,
  Truck,
  Users,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  deleteAllNotifications,
  clearError 
} from '../slices/notificationSlice';

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

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading, error, total, unreadCount } = useSelector((state) => state.notifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', isRead: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markAsRead(id)).unwrap();
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      await dispatch(deleteNotification(selectedNotification.id)).unwrap();
      toast.success('Notification deleted');
      setShowDeleteModal(false);
      setSelectedNotification(null);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await dispatch(deleteAllNotifications()).unwrap();
        toast.success('All notifications deleted');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const columns = [
    {
      key: 'notification',
      label: 'Notification',
      render: (row) => {
        const Icon = iconMap[row.type] || iconMap.default;
        const color = colorMap[row.type] || colorMap.default;
        return (
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-sm ${!row.isRead ? 'font-semibold' : ''} text-gray-900 dark:text-white`}>
                {row.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{row.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                </span>
                {!row.isRead && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.isRead && (
            <button
              onClick={() => handleMarkAsRead(row.id)}
              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => {
              setSelectedNotification(row);
              setShowDeleteModal(true);
            }}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {unreadCount} unread notifications out of {total}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark All Read
            </Button>
          )}
          {total > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAll}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete All
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="inventory">Inventory</option>
            <option value="sales">Sales</option>
            <option value="purchases">Purchases</option>
            <option value="transfers">Transfers</option>
            <option value="users">Users</option>
            <option value="payment">Payment</option>
            <option value="warning">Warning</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.isRead}
            onChange={(e) => setFilters({ ...filters, isRead: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <Table
        columns={columns}
        data={notifications}
        loading={isLoading}
        pagination={true}
        pageSize={20}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNotification(null);
        }}
        title="Delete Notification"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Delete this notification?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedNotification(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationCenter;