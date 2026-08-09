import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ClipboardList,
  TrendingUp,
  Eye,
  Microscope
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchBatches, deleteBatch, clearError } from '../slices/inventorySlice';

const BatchList = () => {
  const dispatch = useDispatch();
  const { batches = [], isLoading = false, error = null } = useSelector((state) => state.inventory || { batches: [], isLoading: false, error: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ status: '', productId: '' });

  useEffect(() => {
    loadBatches();
  }, [searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadBatches = async () => {
    try {
      await dispatch(fetchBatches({ search: searchTerm, ...filters })).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      AVAILABLE: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      PARTIAL: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: AlertCircle },
      EXPIRED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
      QUARANTINED: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
      DISPOSED: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', icon: XCircle }
    };
    const statusInfo = statuses[status] || statuses.AVAILABLE;
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
      key: 'batchNumber',
      label: 'Batch',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.batchNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.product?.name || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => row.supplier?.name || 'N/A'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-medium ml-1">{row.quantity}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Remaining:</span>
            <span className="font-medium ml-1">{row.remainingQuantity}</span>
          </div>
        </div>
      )
    },
    {
      key: 'quality',
      label: 'Quality',
      render: (row) => (
        <div className="space-y-0.5 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400">Grade:</span>
            <span className="font-medium">{row.grade || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 dark:text-gray-400">Freshness:</span>
            <span className="font-medium">{row.freshnessScore || 'N/A'}</span>
          </div>
          {!row.isQualityChecked && (
            <span className="text-xs text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Pending Inspection
            </span>
          )}
        </div>
      )
    },
    {
      key: 'dates',
      label: 'Dates',
      render: (row) => (
        <div className="space-y-0.5 text-sm">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>Arrival: {new Date(row.arrivalDate).toLocaleDateString()}</span>
          </div>
          {row.expiryDate && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Expiry: {new Date(row.expiryDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedBatch(row);
              setShowQualityModal(true);
            }}
            className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Quality Inspection"
          >
            <Microscope className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedBatch(row);
              setIsEditing(true);
              setShowModal(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Batch Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track inventory batches and quality
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedBatch(null);
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search batches by number, product, or supplier..."
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
            <option value="AVAILABLE">Available</option>
            <option value="PARTIAL">Partial</option>
            <option value="EXPIRED">Expired</option>
            <option value="QUARANTINED">Quarantined</option>
            <option value="DISPOSED">Disposed</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={batches}
        loading={isLoading}
        onRowClick={(row) => {
          setSelectedBatch(row);
          setIsEditing(true);
          setShowModal(true);
        }}
      />
    </div>
  );
};

export default BatchList;
