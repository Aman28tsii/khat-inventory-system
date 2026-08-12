import apiClient from '../../../api/client';

export const customerService = {
  getAll: (params) => apiClient.get('/customers', { params }),
  getById: (id) => apiClient.get(`/customers/${id}`),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
  toggleStatus: (id) => apiClient.put(`/customers/${id}/status`),
  getCreditHistory: (id) => apiClient.get(`/customers/${id}/credit-history`)
};


