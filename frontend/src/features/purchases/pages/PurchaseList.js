import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Package,
  Users,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchPurchases, deletePurchase, clearError } from '../slices/purchaseSlice';

const PurchaseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { purchases = [], isLoading = false, error = null, total = 0 } = useSelector((state) => state.purchases || { purchases: [], isLoading: false, error: null, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [filters, setFilters] = useState({ status: '', supplier: '' });

  useEffect(() => {
    dispatch(fetchPurchases({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async () => {
    if (!selectedPurchase) return;
    try {
      await dispatch(deletePurchase(selectedPurchase.id)).unwrap();
      toast.success('Purchase deleted successfully');
      setShowDeleteModal(false);
      setSelectedPurchase(null);
    } catch (error) {
      toast.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      DRAFT: { color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: Clock },
      ORDERED: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Truck },
      RECEIVED: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
      PARTIAL: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
      RETURNED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
      CANCELLED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
    };
    const statusInfo = statuses[status] || statuses.DRAFT;
    const Icon = statusInfo.icon;
    return (
      <span className={'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ' + statusInfo.color}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return '$' + num.toFixed(2);
  };

  const columns = [
    {
      key: 'purchaseNumber',
      label: 'Purchase',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.purchaseNumber}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(row.purchaseDate).toLocaleDateString()}
          </p>
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white">{row.supplier?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'branch',
      label: 'Branch',
      render: (row) => row.branch?.name || 'N/A'
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
            Items: {row.items?.length || 0}
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
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/purchases/' + row.id)}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'DRAFT' && (
            <>
              <button
                onClick={() => navigate('/purchases/' + row.id + '/edit')}
                className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedPurchase(row);
                  setShowDeleteModal(true);
                }}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {row.status === 'ORDERED' && (
            <button
              onClick={() => navigate('/purchases/' + row.id + '/receive')}
              className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Receive"
            >
              <Package className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Purchase Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage purchase orders and receiving
          </p>
        </div>
        <Link to="/purchases/create">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Purchase
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search purchases by number, supplier, or branch..."
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
            <option value="DRAFT">Draft</option>
            <option value="ORDERED">Ordered</option>
            <option value="RECEIVED">Received</option>
            <option value="PARTIAL">Partial</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={purchases}
        loading={isLoading}
        onRowClick={(row) => navigate('/purchases/' + row.id)}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPurchase(null);
        }}
        title="Delete Purchase Order"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Delete Purchase Order?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. This will permanently delete 
                purchase order <span className="font-medium">{selectedPurchase?.purchaseNumber}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedPurchase(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurchaseList;
