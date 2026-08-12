import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Eye, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import { fetchAuditLogs, clearError } from '../slices/auditSlice';
import { useLanguage } from '../../../context/LanguageContext';

const AuditLogs = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { logs = [], isLoading = false, error = null, total = 0 } = useSelector((state) => state.audit || { logs: [], isLoading: false, error: null, total: 0 });

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const columns = [
    {
      key: 'timestamp',
      label: t('reports.dateRange'),
      render: (row) => (
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
            <Clock className="w-3 h-3 text-gray-400" />
            {new Date(row.createdAt).toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
          </div>
        </div>
      )
    },
    {
      key: 'user',
      label: t('users.user'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {row.user?.firstName} {row.user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.user?.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      label: t('common.actions'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.action === 'CREATE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : row.action === 'UPDATE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : row.action === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300')}>
          {row.action}
        </span>
      )
    },
    {
      key: 'resource',
      label: t('products.resource'),
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">{row.resourceType}</p>
          {row.resourceId && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              ID: {row.resourceId.substring(0, 8)}...
            </p>
          )}
        </div>
      )
    },
    {
      key: 'ip',
      label: 'IP Address',
      render: (row) => (
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
          {row.ipAddress || 'N/A'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auditLogs')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auditLogs')}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => dispatch(fetchAuditLogs())} isLoading={isLoading}>
          {t('common.refresh')}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{t('errors.generic')}: {error}</p>
        </div>
      )}

      <Table
        columns={columns}
        data={logs}
        loading={isLoading}
        pagination={true}
        pageSize={20}
      />
    </div>
  );
};

export default AuditLogs;

