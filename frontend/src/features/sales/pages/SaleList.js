import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Search,
  Calendar,
  DollarSign,
  Users,
  Eye,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Button from '../../../components/common/Button/Button';
import { fetchSales, clearError } from '../slices/saleSlice';

const SaleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sales = [], isLoading = false, error = null, total = 0 } = useSelector((state) => state.sales || { sales: [], isLoading: false, error: null, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', paymentStatus: '' });

  useEffect(() => {
    dispatch(fetchSales({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return '$' + num.toFixed(2);
  };

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      COMPLETED: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
      RETURNED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
    };
    const statusInfo = statuses[status] || statuses.PENDING;
    const Icon = statusInfo.icon;
    return (
      <span className={'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ' + statusInfo.color}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statuses = {
      PENDING: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      PARTIAL: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      PAID: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return (
      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (statuses[status] || statuses.PENDING)}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: 'saleNumber',
      label: 'Sale',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.saleNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(row.saleDate).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white">{row.customer?.name || 'Walk-in Customer'}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(row.totalAmount)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Paid: {formatCurrency(row.paidAmount)}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (row) => getPaymentStatusBadge(row.paymentStatus)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/sales/' + row.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.paymentStatus !== 'PAID' && row.status === 'COMPLETED' && (
            <button
              onClick={() => navigate('/sales/' + row.id + '/payment')}
              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage sales and payments</p>
        </div>
        <Link to="/sales/create">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search sales by number, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="">All Payment</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      
      {sales.length === 0 && !isLoading && (
        <EmptyState 
          title='No Sales Found' 
          description='Start by creating your first sale' 
          actionText='New Sale' 
          onAction={() => navigate('/sales/create')} 
        />
      )}
      <Table
        columns={columns}
        data={sales}
        loading={isLoading}
        onRowClick={(row) => navigate('/sales/' + row.id)}
      />
    </div>
  );
};

export default SaleList;

