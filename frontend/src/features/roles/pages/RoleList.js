import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import { fetchRoles } from '../slices/rolesSlice';

const RoleList = () => {
  const dispatch = useDispatch();
  const { roles, isLoading, error } = useSelector((state) => state.roles || { roles: [], isLoading: false, error: null });
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const columns = [
    {
      key: 'name',
      label: 'Role Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-600" />
          <span className="font-medium">{row.name}</span>
          {row.isSystem && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">System</span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => row.description || 'â€”'
    },
    {
      key: 'level',
      label: 'Level',
      render: (row) => (
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
          {row.level}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Roles & Permissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage system roles and their permissions
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Table columns={columns} data={roles} loading={isLoading} />
    </div>
  );
};

export default RoleList;



