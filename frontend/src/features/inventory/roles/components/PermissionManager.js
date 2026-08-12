import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Check, X, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import { roleService } from '../services/roleService';

const PermissionManager = ({ role, onSuccess }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock permissions - In real app, fetch from API
    const allPermissions = [
      { id: '1', resource: 'user', action: 'create', description: 'Create users' },
      { id: '2', resource: 'user', action: 'read', description: 'View users' },
      { id: '3', resource: 'user', action: 'update', description: 'Update users' },
      { id: '4', resource: 'user', action: 'delete', description: 'Delete users' },
      { id: '5', resource: 'inventory', action: 'create', description: 'Create inventory' },
      { id: '6', resource: 'inventory', action: 'read', description: 'View inventory' },
      { id: '7', resource: 'inventory', action: 'update', description: 'Update inventory' },
      { id: '8', resource: 'inventory', action: 'delete', description: 'Delete inventory' },
      { id: '9', resource: 'sales', action: 'create', description: 'Create sales' },
      { id: '10', resource: 'sales', action: 'read', description: 'View sales' },
      { id: '11', resource: 'sales', action: 'update', description: 'Update sales' },
      { id: '12', resource: 'sales', action: 'delete', description: 'Delete sales' },
      { id: '13', resource: 'reports', action: 'read', description: 'View reports' },
      { id: '14', resource: 'reports', action: 'export', description: 'Export reports' },
      { id: '15', resource: 'settings', action: 'read', description: 'View settings' },
      { id: '16', resource: 'settings', action: 'update', description: 'Update settings' },
    ];
    setPermissions(allPermissions);
    setSelectedPermissions(role.permissions?.map(p => p.id) || []);
  }, [role]);

  const togglePermission = (permissionId) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await roleService.assignPermissions(role.id, selectedPermissions);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    if (!groups[permission.resource]) {
      groups[permission.resource] = [];
    }
    groups[permission.resource].push(permission);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <div key={resource} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              {resource}
            </h4>
            <div className="space-y-2">
              {perms.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {permission.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {permission.description}
                    </p>
                  </div>
                  {selectedPermissions.includes(permission.id) && (
                    <Check className="w-4 h-4 text-primary-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onSuccess} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>
          Save Permissions
        </Button>
      </div>
    </div>
  );
};

export default PermissionManager;

