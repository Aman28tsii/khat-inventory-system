import apiClient from '../../../api/client';

export const dashboardService = {
  getExecutive: () => apiClient.get('/dashboard/executive'),
  getWarehouse: () => apiClient.get('/dashboard/warehouse'),
  getBranch: () => apiClient.get('/dashboard/branch'),
  getInventoryManager: () => apiClient.get('/dashboard/inventory-manager'),
  getAccountant: () => apiClient.get('/dashboard/accountant'),
  getCashier: () => apiClient.get('/dashboard/cashier'),
  getRecentActivities: () => apiClient.get('/dashboard/recent-activities'),
  getAlerts: () => apiClient.get('/dashboard/alerts')
};
