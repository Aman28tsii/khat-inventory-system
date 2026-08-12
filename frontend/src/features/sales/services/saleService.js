import apiClient from '../../../api/client';

export const saleService = {
  getAll: (params) => apiClient.get('/sales', { params }),
  getById: (id) => apiClient.get(`/sales/${id}`),
  create: (data) => apiClient.post('/sales', data),
  update: (id, data) => apiClient.put(`/sales/${id}`, data),
  delete: (id) => apiClient.delete(`/sales/${id}`),
  processPayment: (id, data) => apiClient.post(`/sales/${id}/payment`, data),
  getPayments: (id) => apiClient.get(`/sales/${id}/payments`),
  returnSale: (id, data) => apiClient.post(`/sales/${id}/return`, data),
  getAvailableBatches: (productId) => apiClient.get(`/sales/available-batches/${productId}`)
};

