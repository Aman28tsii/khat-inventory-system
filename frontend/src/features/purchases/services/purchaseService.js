import apiClient from '../../../api/client';

export const purchaseService = {
  getAll: (params) => apiClient.get('/purchases', { params }),
  getById: (id) => apiClient.get(`/purchases/${id}`),
  create: (data) => apiClient.post('/purchases', data),
  update: (id, data) => apiClient.put(`/purchases/${id}`, data),
  delete: (id) => apiClient.delete(`/purchases/${id}`),
  receive: (id, data) => apiClient.post(`/purchases/${id}/receive`, data),
  approve: (id) => apiClient.post(`/purchases/${id}/approve`),
  reject: (id, data) => apiClient.post(`/purchases/${id}/reject`, data),
  getItems: (id) => apiClient.get(`/purchases/${id}/items`),
  addItem: (id, data) => apiClient.post(`/purchases/${id}/items`, data),
  removeItem: (id, itemId) => apiClient.delete(`/purchases/${id}/items/${itemId}`)
};