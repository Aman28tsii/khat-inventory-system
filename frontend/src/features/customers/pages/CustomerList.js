import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Power,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Eye,
  DollarSign,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import CustomerForm from '../components/CustomerForm';
import CustomerCreditModal from '../components/CustomerCreditModal';
import { fetchCustomers, deleteCustomer, toggleCustomerStatus, clearError, setSelectedCustomer } from '../slices/customerSlice';

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customers, isLoading, error, total } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomerLocal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ type: '', status: '' });

  useEffect(() => {
    dispatch(fetchCustomers({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (customer) => {
    if (window.confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      try {
        await dispatch(deleteCustomer(customer.id)).unwrap();
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      await dispatch(toggleCustomerStatus(customer.id)).unwrap();
      toast.success(`Customer ${customer.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error(error);
    }
  };

  const getTypeBadge = (type) => {
    const types = {
      INDIVIDUAL: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: User },
      BUSINESS: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: Building2 },
      WHOLESALE: { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: Users },
      RETAIL: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: Users }
    };
    return types[type] || types.INDIVIDUAL;
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const type = getTypeBadge(row.type);
        const Icon = type.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${type.color}`}>
            <Icon className="w-3 h-3" />
            {row.type || 'INDIVIDUAL'}
          </span>
        );
      }
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (row) => (
        <div className="space-y-0.5 text-sm">
          {row.phone && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Phone className="w-3 h-3" />
              <span>{row.phone}</span>
            </div>
          )}
          {row.email && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-xs">{row.email}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-sm">
            <CreditCard className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Limit:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${row.creditLimit || 0}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Used:</span>
            <span className={`font-medium ${row.currentCredit > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
              ${row.currentCredit || 0}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedCustomerLocal(row);
              setShowCreditModal(true);
            }}
            className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="View Credit History"
          >
            <CreditCard className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedCustomerLocal(row);
              setIsEditing(true);
              setShowModal(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className={`p-1 rounded-lg transition-colors ${
              row.isActive
                ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
            Customer Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage customers and their credit accounts
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedCustomerLocal(null);
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers by name, code, email, or phone..."
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
            <option value="INDIVIDUAL">Individual</option>
            <option value="BUSINESS">Business</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="RETAIL">Retail</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <Table
        columns={columns}
        data={customers}
        loading={isLoading}
        onRowClick={(row) => {
          setSelectedCustomerLocal(row);
          setIsEditing(true);
          setShowModal(true);
        }}
      />

      {/* Customer Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCustomerLocal(null);
        }}
        title={isEditing ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={selectedCustomerLocal}
          isEditing={isEditing}
          onSuccess={() => {
            setShowModal(false);
            setSelectedCustomerLocal(null);
            dispatch(fetchCustomers({ search: searchTerm, ...filters }));
            toast.success(isEditing ? 'Customer updated successfully' : 'Customer created successfully');
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedCustomerLocal(null);
          }}
        />
      </Modal>

      {/* Credit History Modal */}
      <Modal
        isOpen={showCreditModal}
        onClose={() => {
          setShowCreditModal(false);
          setSelectedCustomerLocal(null);
        }}
        title={`Credit History: ${selectedCustomerLocal?.name}`}
        size="lg"
      >
        <CustomerCreditModal customerId={selectedCustomerLocal?.id} />
      </Modal>
    </div>
  );
};

export default CustomerList;