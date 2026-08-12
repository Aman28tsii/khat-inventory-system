import apiClient from '../../../api/client';

export const transferService = {
  getAll: (params) => apiClient.get('/transfers', { params }),
  getById: (id) => apiClient.get(`/transfers/${id}`),
  create: (data) => apiClient.post('/transfers', data),
  update: (id, data) => apiClient.put(`/transfers/${id}`, data),
  delete: (id) => apiClient.delete(`/transfers/${id}`),
  approve: (id) => apiClient.post(`/transfers/${id}/approve`),
  reject: (id, data) => apiClient.post(`/transfers/${id}/reject`, data),
  receive: (id, data) => apiClient.post(`/transfers/${id}/receive`, data),
  getItems: (id) => apiClient.get(`/transfers/${id}/items`),
  getAvailableBatches: (branchId) => apiClient.get(`/transfers/available-batches/${branchId}`)
};

