import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import { fetchStockMovements, clearError } from '../slices/inventorySlice';
import { useLanguage } from '../../../context/LanguageContext';

const StockMovements = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { movements = [], isLoading = false, error = null } = useSelector((state) => state.inventory || { movements: [], isLoading: false, error: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', dateRange: '' });

  useEffect(() => {
    dispatch(fetchStockMovements({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const columns = [
    {
      key: 'date',
      label: t('inventory.arrivalDate'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: t('inventory.stockMovements'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.movementType === 'IN' ? 'bg-green-100 text-green-700' : row.movementType === 'OUT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>
          {row.movementType}
        </span>
      )
    },
    {
      key: 'product',
      label: t('inventory.productName'),
      render: (row) => row.product?.name || 'N/A'
    },
    {
      key: 'quantity',
      label: t('inventory.quantity'),
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm font-medium">{row.quantity}</div>
          <div className="text-xs text-gray-500">{t('inventory.availableQuantity')}: {row.previousQuantity} → {row.newQuantity}</div>
        </div>
      )
    },
    {
      key: 'branch',
      label: t('inventory.branch'),
      render: (row) => row.branch?.name || 'N/A'
    },
    {
      key: 'createdBy',
      label: t('users.user'),
      render: (row) => row.creator?.firstName + ' ' + row.creator?.lastName || 'N/A'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('inventory.stockMovements')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('inventory.stockMovements')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('common.search') + ' ' + t('inventory.stockMovements') + '...'}
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
            <option value="">{t('common.all')}</option>
            <option value="IN">{t('inventory.available')}</option>
            <option value="OUT">{t('inventory.disposed')}</option>
            <option value="TRANSFER">{t('transfers.title')}</option>
            <option value="ADJUSTMENT">{t('inventory.stockMovements')}</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="">{t('common.all')}</option>
            <option value="today">{t('reports.today')}</option>
            <option value="week">{t('reports.thisWeek')}</option>
            <option value="month">{t('reports.thisMonth')}</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={movements}
        loading={isLoading}
        pagination={true}
        pageSize={10}
      />
    </div>
  );
};

export default StockMovements;
