import apiClient from '../../../api/client';

export const auditService = {
  getAll: (params) => apiClient.get('/audit-logs', { params }),
  getById: (id) => apiClient.get(`/audit-logs/${id}`),
  export: (params) => apiClient.post('/audit-logs/export', params, { responseType: 'blob' }),
  getResources: () => apiClient.get('/audit-logs/resources'),
  getActions: () => apiClient.get('/audit-logs/actions')
};

