import apiClient from '../../../api/client';

export const roleService = {
  getAll: () => apiClient.get('/roles'),
  getById: (id) => apiClient.get(`/roles/${id}`),
  create: (data) => apiClient.post('/roles', data),
  update: (id, data) => apiClient.put(`/roles/${id}`, data),
  delete: (id) => apiClient.delete(`/roles/${id}`),
  assignPermissions: (id, permissions) => 
    apiClient.post(`/roles/${id}/permissions`, { permissions }),
  removePermission: (id, permissionId) => 
    apiClient.delete(`/roles/${id}/permissions/${permissionId}`)
};
