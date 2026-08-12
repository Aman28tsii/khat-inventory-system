import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  Search, 
  Upload,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  DollarSign,
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import BulkImport from '../../../components/common/BulkImport/BulkImport';
import { fetchCustomers, deleteCustomer, toggleCustomerStatus, clearError } from '../slices/customerSlice';
import { useLanguage } from '../../../context/LanguageContext';

const CustomerList = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { customers = [], isLoading = false, error = null, total = 0 } = useSelector((state) => state.customers || { customers: [], isLoading: false, error: null, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'INDIVIDUAL',
    phone: '',
    email: '',
    address: '',
    taxId: '',
    creditLimit: '',
    paymentTerms: '',
    isActive: true
  });

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
    if (window.confirm(t('modals.areYouSure') + ' "' + customer.name + '"?')) {
      try {
        await dispatch(deleteCustomer(customer.id)).unwrap();
        toast.success(t('common.delete') + ' ' + t('customers.customerName'));
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      await dispatch(toggleCustomerStatus(customer.id)).unwrap();
      toast.success(customer.isActive ? t('common.inactive') : t('common.active'));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await dispatch(updateCustomer({ id: selectedCustomer.id, data: formData })).unwrap();
      } else {
        await dispatch(createCustomer(formData)).unwrap();
      }
      setShowModal(false);
      toast.success(isEditing ? t('customers.editCustomer') + ' ' + t('common.success') : t('customers.createCustomer') + ' ' + t('common.success'));
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
      label: t('customers.customerName'),
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
      label: t('customers.customerType'),
      render: (row) => {
        const type = getTypeBadge(row.type);
        const Icon = type.icon;
        return (
          <span className={'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ' + type.color}>
            <Icon className="w-3 h-3" />
            {row.type || 'INDIVIDUAL'}
          </span>
        );
      }
    },
    {
      key: 'contact',
      label: t('common.contact'),
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
      label: t('customers.creditLimit'),
      render: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-sm">
            <CreditCard className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{t('customers.creditLimit')}:</span>
            <span className="font-medium text-gray-900 dark:text-white"></span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{t('sales.used')}:</span>
            <span className={'font-medium ' + (row.currentCredit > 0 ? 'text-yellow-600' : 'text-green-600')}>
              
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('common.status'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
          {row.isActive ? t('common.active') : t('common.inactive')}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCustomer(row);
              setFormData({
                name: row.name,
                code: row.code,
                type: row.type || 'INDIVIDUAL',
                phone: row.phone || '',
                email: row.email || '',
                address: row.address || '',
                taxId: row.taxId || '',
                creditLimit: row.creditLimit || '',
                paymentTerms: row.paymentTerms || '',
                isActive: row.isActive
              });
              setIsEditing(true);
              setShowModal(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className={'p-1 rounded-lg transition-colors ' + (row.isActive ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20')}
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
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('customers.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('customers.title')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowBulkImport(true)}>
            <Upload className="w-4 h-4 mr-2" /> {t('products.importCSV')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCustomer(null);
              setFormData({
                name: '',
                code: '',
                type: 'INDIVIDUAL',
                phone: '',
                email: '',
                address: '',
                taxId: '',
                creditLimit: '',
                paymentTerms: '',
                isActive: true
              });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('customers.createCustomer')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('common.search') + ' ' + t('customers.customerName') + ' ' + t('common.or') + ' ' + t('customers.customerCode')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">{t('common.all')}</option>
            <option value="INDIVIDUAL">{t('customers.individual')}</option>
            <option value="BUSINESS">{t('customers.business')}</option>
            <option value="WHOLESALE">{t('customers.wholesale')}</option>
            <option value="RETAIL">{t('customers.retail')}</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">{t('common.all')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="inactive">{t('common.inactive')}</option>
          </select>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {customers.length === 0 && !isLoading && (
        <EmptyState
          title={t('customers.noCustomers')}
          description={t('common.add') + ' ' + t('customers.title')}
          actionText={t('customers.createCustomer')}
          onAction={() => {
            setSelectedCustomer(null);
            setFormData({
              name: '',
              code: '',
              type: 'INDIVIDUAL',
              phone: '',
              email: '',
              address: '',
              taxId: '',
              creditLimit: '',
              paymentTerms: '',
              isActive: true
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        />
      )}
      <Table columns={columns} data={customers} loading={isLoading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEditing ? t('customers.editCustomer') : t('customers.createCustomer')} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('customers.customerName')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., John Doe" required />
            <Input label={t('customers.customerCode')} value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., CUST-001" required disabled={isEditing} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('customers.customerType')}</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="INDIVIDUAL">{t('customers.individual')}</option>
              <option value="BUSINESS">{t('customers.business')}</option>
              <option value="WHOLESALE">{t('customers.wholesale')}</option>
              <option value="RETAIL">{t('customers.retail')}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('auth.phone')} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+251-XXX-XXXX" />
            <Input label={t('auth.email')} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="customer@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('branches.address')}</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder={t('branches.address')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('customers.taxId')} value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} placeholder="e.g., 123456789" />
            <Input label={t('customers.paymentTerms')} value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} placeholder="e.g., Net 30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('customers.creditLimit')} type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })} placeholder="0.00" />
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('common.active')}</label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</Button>
            <Button variant="primary" onClick={handleSubmit}>{isEditing ? t('customers.editCustomer') : t('customers.createCustomer')}</Button>
          </div>
        </div>
      </Modal>

      <BulkImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        type="customers"
        onSuccess={() => {
          dispatch(fetchCustomers());
          toast.success(t('products.bulkImport') + ' ' + t('common.success'));
        }}
      />
    </div>
  );
};

export default CustomerList;

