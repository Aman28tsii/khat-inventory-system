import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Table from '../../../components/common/Table/Table';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import PermissionManager from '../components/PermissionManager';
import { fetchRoles, deleteRole, clearError } from '../slices/rolesSlice';

const RoleList = () => {
  const dispatch = useDispatch();
  const { roles, isLoading, error } = useSelector((state) => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', level: 1 });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (role) => {
    if (role.isSystem) {
      toast.error('System roles cannot be deleted');
      return;
    }
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await dispatch(deleteRole(role.id)).unwrap();
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await dispatch(updateRole({ id: selectedRole.id, data: formData })).unwrap();
      } else {
        await dispatch(createRole(formData)).unwrap();
      }
      setShowModal(false);
      toast.success(isEditing ? 'Role updated successfully' : 'Role created successfully');
    } catch (error) {
      toast.error(error);
    }
  };

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
      render: (row) => row.description || '—'
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
    {
      key: 'permissions',
      label: 'Permissions',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {row.permissions?.length || 0} permissions
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
              setSelectedRole(row);
              setShowPermissionModal(true);
            }}
            className="p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>
          {!row.isSystem && (
            <>
              <button
                onClick={() => {
                  setSelectedRole(row);
                  setFormData({ name: row.name, description: row.description || '', level: row.level });
                  setIsEditing(true);
                  setShowModal(true);
                }}
                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
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
            Roles & Permissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage system roles and their permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedRole(null);
            setFormData({ name: '', description: '', level: 1 });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Table */}
      <Table
        columns={columns}
        data={roles}
        loading={isLoading}
      />

      {/* Role Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? 'Edit Role' : 'Create New Role'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Role Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Inventory Manager"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role's purpose"
            />
          </div>
          <Input
            label="Level (1-100)"
            type="number"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
            min="1"
            max="100"
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Permission Manager Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title={`Permissions: ${selectedRole?.name}`}
        size="lg"
      >
        {selectedRole && (
          <PermissionManager
            role={selectedRole}
            onSuccess={() => {
              setShowPermissionModal(false);
              dispatch(fetchRoles());
              toast.success('Permissions updated successfully');
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default RoleList;