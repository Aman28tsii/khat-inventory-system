import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Plus, 
  Search,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import { fetchTransfers, clearError } from '../slices/transferSlice';
import { useLanguage } from '../../../context/LanguageContext';

const TransferList = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { transfers, isLoading, error, total } = useSelector((state) => state.transfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '' });

  useEffect(() => {
    dispatch(fetchTransfers({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      APPROVED: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
      IN_TRANSIT: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Truck },
      RECEIVED: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
      CANCELLED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
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

  const columns = [
    {
      key: 'transferNumber',
      label: t('transfers.transferNumber'),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.transferNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(row.transferDate).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'fromBranch',
      label: t('transfers.fromBranch') + ' → ' + t('transfers.toBranch'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-white">{row.fromBranch?.name || 'N/A'}</span>
          <ArrowLeftRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white">{row.toBranch?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'items',
      label: t('sales.items'),
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.items?.length || 0} {t('sales.items')}
        </span>
      )
    },
    {
      key: 'status',
      label: t('status'),
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/transfers/' + row.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'PENDING' && (
            <button
              onClick={() => navigate('/transfers/' + row.id + '/approve')}
              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.status === 'APPROVED' && (
            <button
              onClick={() => navigate('/transfers/' + row.id + '/receive')}
              className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              <Truck className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('transfers.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('transfers.title')}</p>
        </div>
        <Link to="/transfers/create">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            {t('transfers.newTransfer')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('search') + ' ' + t('transfers.transferNumber') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">{t('all')}</option>
          <option value="PENDING">{t('sales.pending')}</option>
          <option value="APPROVED">{t('transfers.approved')}</option>
          <option value="IN_TRANSIT">{t('transfers.inTransit')}</option>
          <option value="RECEIVED">{t('purchases.received')}</option>
          <option value="REJECTED">{t('transfers.rejected')}</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={transfers}
        loading={isLoading}
        onRowClick={(row) => navigate('/transfers/' + row.id)}
      />
    </div>
  );
};

export default TransferList;


