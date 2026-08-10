import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Truck, Plus, Edit, Trash2, Power, Search, Mail, Phone, MapPin, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import LoadingSpinner from '../../../components/common/LoadingSpinner/LoadingSpinner';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import BulkImport from '../../../components/common/BulkImport/BulkImport';
import { fetchSuppliers, deleteSupplier, toggleSupplierStatus, clearError } from '../slices/supplierSlice';

const SupplierList = () => {
  const dispatch = useDispatch();
  const { suppliers = [], isLoading = false, error = null } = useSelector((state) => state.suppliers || { suppliers: [], isLoading: false, error: null });
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    taxId: '',
    paymentTerms: '',
    creditLimit: '',
    isActive: true
  });

  useEffect(() => {
    loadSuppliers();
  }, [dispatch, searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadSuppliers = async () => {
    try {
      await dispatch(fetchSuppliers({ search: searchTerm })).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleDelete = async (supplier) => {
    if (window.confirm('Are you sure you want to delete "' + supplier.name + '"?')) {
      try {
        await dispatch(deleteSupplier(supplier.id)).unwrap();
        toast.success('Supplier deleted successfully');
        loadSuppliers();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleStatus = async (supplier) => {
    try {
      await dispatch(toggleSupplierStatus(supplier.id)).unwrap();
      toast.success('Supplier ' + (supplier.isActive ? 'deactivated' : 'activated') + ' successfully');
      loadSuppliers();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await dispatch(updateSupplier({ id: selectedSupplier.id, data: formData })).unwrap();
      } else {
        await dispatch(createSupplier(formData)).unwrap();
      }
      setShowModal(false);
      toast.success(isEditing ? 'Supplier updated successfully' : 'Supplier created successfully');
      loadSuppliers();
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.code}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      render: (row) => row.contactPerson || 'N/A'
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
      key: 'address',
      label: 'Address',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-xs">{row.address || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedSupplier(row);
              setFormData({
                name: row.name,
                code: row.code,
                contactPerson: row.contactPerson || '',
                phone: row.phone || '',
                email: row.email || '',
                address: row.address || '',
                taxId: row.taxId || '',
                paymentTerms: row.paymentTerms || '',
                creditLimit: row.creditLimit || '',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage suppliers and vendors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowBulkImport(true)}>
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedSupplier(null);
              setFormData({
                name: '',
                code: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                taxId: '',
                paymentTerms: '',
                creditLimit: '',
                isActive: true
              });
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search suppliers by name, code, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {suppliers.length === 0 && !isLoading && (
        <EmptyState
          title="No Suppliers Found"
          description="Start by adding your first supplier"
          actionText="Add Supplier"
          onAction={() => {
            setSelectedSupplier(null);
            setFormData({
              name: '',
              code: '',
              contactPerson: '',
              phone: '',
              email: '',
              address: '',
              taxId: '',
              paymentTerms: '',
              creditLimit: '',
              isActive: true
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        />
      )}
      <Table
        columns={columns}
        data={suppliers}
        loading={isLoading}
        pagination={true}
        pageSize={10}
        onRowClick={(row) => {
          setSelectedSupplier(row);
          setFormData({
            name: row.name,
            code: row.code,
            contactPerson: row.contactPerson || '',
            phone: row.phone || '',
            email: row.email || '',
            address: row.address || '',
            taxId: row.taxId || '',
            paymentTerms: row.paymentTerms || '',
            creditLimit: row.creditLimit || '',
            isActive: row.isActive
          });
          setIsEditing(true);
          setShowModal(true);
        }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSupplier(null);
        }}
        title={isEditing ? 'Edit Supplier' : 'Add New Supplier'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Supplier Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., ABC Trading"
              required
            />
            <Input
              label="Supplier Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., SUP-001"
              required
            />
          </div>

          <Input
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            placeholder="e.g., John Doe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+251-XXX-XXXX"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="info@supplier.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tax ID (TIN)"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="e.g., 123456789"
            />
            <Input
              label="Payment Terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="e.g., Net 30"
            />
          </div>

          <Input
            label="Credit Limit"
            type="number"
            value={formData.creditLimit}
            onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
            placeholder="0.00"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? 'Update Supplier' : 'Create Supplier'}
            </Button>
          </div>
        </div>
      </Modal>

      <BulkImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        type="suppliers"
        onSuccess={() => {
          dispatch(fetchSuppliers());
          toast.success('Suppliers imported successfully');
        }}
      />
    </div>
  );
};

export default SupplierList;