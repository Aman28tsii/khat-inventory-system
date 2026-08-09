import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Download,
  Eye,
  User,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import AuditFilters from '../components/AuditFilters';
import AuditLogDetail from '../components/AuditLogDetail';
import { fetchAuditLogs, fetchAuditLogById, exportAuditLogs, clearError } from '../slices/auditSlice';

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { logs, selectedLog, isLoading, exporting, error, total } = useSelector((state) => state.audit);
  const [filters, setFilters] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadLogs = (newFilters = {}) => {
    const appliedFilters = { ...filters, ...newFilters };
    setFilters(appliedFilters);
    dispatch(fetchAuditLogs(appliedFilters));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLogs(filters);
    setIsRefreshing(false);
    toast.success('Audit logs refreshed');
  };

  const handleViewDetail = async (id) => {
    try {
      await dispatch(fetchAuditLogById(id)).unwrap();
      setShowDetailModal(true);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await dispatch(exportAuditLogs(filters)).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Audit logs exported successfully');
    } catch (error) {
      toast.error('Failed to export audit logs');
    }
  };

  const getActionColor = (action) => {
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
      ),
      sortable: true
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(row.action)}`}>
          {row.action}
        </span>
      ),
      sortable: true
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
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleViewDetail(row.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Audit Logs
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Complete audit trail of all system activities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            isLoading={isRefreshing}
            onClick={handleRefresh}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={exporting}
            onClick={handleExport}
            disabled={logs.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Set(logs.map(l => l.userId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Logs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AuditFilters
        onApply={(newFilters) => loadLogs(newFilters)}
        onClear={() => loadLogs({})}
        isLoading={isLoading}
      />

      {/* Logs Table */}
      <Table
        columns={columns}
        data={logs || []}
        loading={isLoading}
        pagination={true}
        pageSize={20}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          dispatch(setSelectedLog(null));
        }}
        title="Audit Log Details"
        size="lg"
      >
        <AuditLogDetail
          log={selectedLog}
          onClose={() => {
            setShowDetailModal(false);
            dispatch(setSelectedLog(null));
          }}
        />
      </Modal>
    </div>
  );
};

export default AuditLogs;