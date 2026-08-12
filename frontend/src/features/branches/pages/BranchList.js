import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Plus, Edit, Trash2, Power, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { fetchBranches, deleteBranch, toggleBranchStatus, clearError } from '../slices/branchesSlice';
import { useLanguage } from '../../../context/LanguageContext';

const BranchList = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { branches = [], isLoading = false, error = null } = useSelector((state) => state.branches || { branches: [], isLoading: false, error: null });
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'BRANCH',
    address: '',
    phone: '',
    email: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (branch) => {
    if (branch.type === 'HEADQUARTERS') {
      toast.error(t('errors.forbidden'));
      return;
    }
    if (window.confirm(t('modals.areYouSure') + ' "' + branch.name + '"?')) {
      try {
        await dispatch(deleteBranch(branch.id)).unwrap();
        toast.success(t('common.delete') + ' ' + t('branches.branchName'));
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleStatus = async (branch) => {
    try {
      await dispatch(toggleBranchStatus(branch.id)).unwrap();
      toast.success(branch.isActive ? t('common.inactive') : t('active'));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await dispatch(updateBranch({ id: selectedBranch.id, data: formData })).unwrap();
      } else {
        await dispatch(createBranch(formData)).unwrap();
      }
      setShowModal(false);
      toast.success(isEditing ? t('branches.editBranch') + ' ' + t('common.success') : t('branches.createBranch') + ' ' + t('common.success'));
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      key: 'name',
      label: t('branches.branchName'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
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
      label: t('branches.branchType'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.type === 'HEADQUARTERS' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : row.type === 'WAREHOUSE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400')}>
          {row.type}
        </span>
      )
    },
    {
      key: 'address',
      label: t('branches.address'),
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-xs">{row.address || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'contact',
      label: t('contact'),
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
      key: 'status',
      label: t('status'),
      render: (row) => (
        <span className={'px-2 py-1 rounded-full text-xs font-medium ' + (row.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')}>
          {row.isActive ? t('active') : t('common.inactive')}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedBranch(row);
              setFormData({
                name: row.name,
                code: row.code,
                type: row.type,
                address: row.address || '',
                phone: row.phone || '',
                email: row.email || '',
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('branches.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('branches.title')}</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedBranch(null);
            setFormData({
              name: '',
              code: '',
              type: 'BRANCH',
              address: '',
              phone: '',
              email: '',
              isActive: true
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> {t('branches.addBranch')}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{t('errors.generic')}: {error}</p>
          <button
            onClick={() => dispatch(fetchBranches())}
            className="mt-2 text-sm text-red-700 dark:text-red-300 hover:underline"
          >
            {t('errors.retry')}
          </button>
        </div>
      )}

      <Table
        columns={columns}
        data={branches}
        loading={isLoading}
        pagination={true}
        pageSize={10}
        onRowClick={(row) => {
          setSelectedBranch(row);
          setFormData({
            name: row.name,
            code: row.code,
            type: row.type,
            address: row.address || '',
            phone: row.phone || '',
            email: row.email || '',
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
          setSelectedBranch(null);
        }}
        title={isEditing ? t('branches.editBranch') : t('branches.createBranch')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('branches.branchName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Addis Ababa Branch"
              required
            />
            <Input
              label={t('branches.branchCode')}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., ADD001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('branches.branchType')}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="HEADQUARTERS">{t('branches.headquarters')}</option>
              <option value="WAREHOUSE">{t('branches.warehouse')}</option>
              <option value="BRANCH">{t('branches.branch')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('branches.address')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('branches.address')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('auth.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+251-XXX-XXXX"
            />
            <Input
              label={t('email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="branch@company.com"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('active')}
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? t('branches.editBranch') : t('branches.createBranch')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BranchList;


