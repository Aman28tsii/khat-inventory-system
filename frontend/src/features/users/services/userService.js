import apiClient from '../../../api/client';

export const userService = {
  getAll: (params) => apiClient.get('/users', { params }),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  toggleStatus: (id) => apiClient.put(`/users/${id}/status`),
  updateRole: (id, roleId) => apiClient.put(`/users/${id}/role`, { roleId }),
  resetPassword: (id) => apiClient.post(`/users/${id}/reset-password`)
};