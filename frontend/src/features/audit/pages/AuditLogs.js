import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Search, Eye, User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Button from '../../../components/common/Button/Button';
import { fetchAuditLogs, clearError } from '../slices/auditSlice';

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { logs = [], isLoading = false, error = null, total = 0 } = useSelector((state) => state.audit || { logs: [], isLoading: false, error: null, total: 0 });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load audit logs. Please try again.');
      setHasError(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadLogs = async () => {
    setHasError(false);
    try {
      await dispatch(fetchAuditLogs()).unwrap();
    } catch (err) {
      setHasError(true);
      toast.error('Could not load audit logs. The server may be unavailable.');
    }
  };

  const columns = [
    {
      key: 'timestamp',
      label: 'Time',
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
      label: 'User',
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
      label: 'Action',
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.action === 'CREATE' ? 'bg-green-100 text-green-700' : row.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : row.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')}>
          {row.action}
        </span>
      )
    },
    {
      key: 'resource',
      label: 'Resource',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">Complete audit trail of all system activities</p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadLogs} isLoading={isLoading}>
          Refresh
        </Button>
      </div>

      {hasError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-700 dark:text-yellow-400">Unable to load audit logs. The API may be unavailable.</p>
          <button
            onClick={loadLogs}
            className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 hover:underline"
          >
            Retry
          </button>
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
