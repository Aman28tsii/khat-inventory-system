import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  Edit, 
  Trash2, 
  Power,
  User,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import UserForm from '../components/UserForm';
import { fetchUsers, deleteUser, toggleUserStatus, clearError } from '../slices/usersSlice';
import { useLanguage } from '../../../context/LanguageContext';

const UserList = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { users, isLoading, error, total } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ role: '', status: '' });

  useEffect(() => {
    dispatch(fetchUsers({ search: searchTerm, ...filters }));
  }, [dispatch, searchTerm, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (user) => {
    if (window.confirm(t('modals.areYouSure') + ' ' + user.firstName + ' ' + user.lastName + '?')) {
      try {
        await dispatch(deleteUser(user.id)).unwrap();
        toast.success(t('common.delete') + ' ' + t('users.user'));
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await dispatch(toggleUserStatus(user.id)).unwrap();
      toast.success(user.isActive ? t('common.inactive') : t('active'));
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      key: 'employeeId',
      label: t('users.employeeId'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <span className="font-medium">{row.employeeId}</span>
        </div>
      )
    },
    {
      key: 'name',
      label: t('users.fullName'),
      render: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: t('email'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{row.email}</span>
        </div>
      )
    },
    {
      key: 'role',
      label: t('users.role'),
      render: (row) => (
        <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
          {row.role?.name || 'N/A'}
        </span>
      )
    },
    {
      key: 'branch',
      label: t('branches.branch'),
      render: (row) => row.branch?.name || 'N/A'
    },
    {
      key: 'status',
      label: t('status'),
      render: (row) => {
        const statusClass = row.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        const statusText = row.isActive ? t('active') : t('common.inactive');
        return <span className={"px-2 py-1 rounded-full text-xs font-medium " + statusClass}>{statusText}</span>;
      }
    },
    {
      key: 'lastLogin',
      label: t('users.lastLogin'),
      render: (row) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'
    },
    {
      key: 'actions',
      label: t('actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUser(row);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('users.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('users.title')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedUser(null);
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t('users.createUser')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('search') + ' ' + t('users.title')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">{t('all')}</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">{t('users.role')}</option>
            <option value="CASHIER">Cashier</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">{t('all')}</option>
            <option value="active">{t('active')}</option>
            <option value="inactive">{t('common.inactive')}</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={users}
        loading={isLoading}
        onRowClick={(row) => {
          setSelectedUser(row);
          setIsEditing(true);
          setShowModal(true);
        }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        title={isEditing ? t('users.editUser') : t('users.createUser')}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          isEditing={isEditing}
          onSuccess={() => {
            setShowModal(false);
            setSelectedUser(null);
            dispatch(fetchUsers({ search: searchTerm, ...filters }));
            toast.success(isEditing ? t('users.editUser') + ' ' + t('common.success') : t('users.createUser') + ' ' + t('common.success'));
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserList;



