import apiClient from '../../../api/client';

export const inventoryService = {
  // Batches
  getBatches: (params) => apiClient.get('/inventory/batches', { params }),
  getBatchById: (id) => apiClient.get(`/inventory/batches/${id}`),
  createBatch: (data) => apiClient.post('/inventory/batches', data),
  updateBatch: (id, data) => apiClient.put(`/inventory/batches/${id}`, data),
  deleteBatch: (id) => apiClient.delete(`/inventory/batches/${id}`),
  
  // Stock Movements
  getMovements: (params) => apiClient.get('/inventory/movements', { params }),
  getMovementById: (id) => apiClient.get(`/inventory/movements/${id}`),
  createMovement: (data) => apiClient.post('/inventory/movements', data),
  
  // Inventory
  getInventory: (params) => apiClient.get('/inventory', { params }),
  getExpiringBatches: () => apiClient.get('/inventory/expiring'),
  
  // Quality
  updateQuality: (id, data) => apiClient.put(`/inventory/batches/${id}/quality`, data),
  inspectBatch: (id, data) => apiClient.post(`/inventory/batches/${id}/inspect`, data)
};
