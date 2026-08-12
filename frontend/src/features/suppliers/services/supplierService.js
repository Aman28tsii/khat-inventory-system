import apiClient from '../../../api/client';

export const supplierService = {
  getAll: (params) => apiClient.get('/suppliers', { params }),
  getById: (id) => apiClient.get(`/suppliers/${id}`),
  create: (data) => apiClient.post('/suppliers', data),
  update: (id, data) => apiClient.put(`/suppliers/${id}`, data),
  delete: (id) => apiClient.delete(`/suppliers/${id}`)
};

