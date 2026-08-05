import apiClient from '../../../api/client';

export const reportService = {
  // Inventory Reports
  getInventoryReport: (params) => apiClient.get('/reports/inventory', { params }),
  getBatchReport: (params) => apiClient.get('/reports/batches', { params }),
  getMovementReport: (params) => apiClient.get('/reports/movements', { params }),
  
  // Sales Reports
  getSalesReport: (params) => apiClient.get('/reports/sales', { params }),
  getSalesByProduct: (params) => apiClient.get('/reports/sales-by-product', { params }),
  getSalesByCustomer: (params) => apiClient.get('/reports/sales-by-customer', { params }),
  
  // Financial Reports
  getProfitReport: (params) => apiClient.get('/reports/profit', { params }),
  getRevenueReport: (params) => apiClient.get('/reports/revenue', { params }),
  
  // Supplier Reports
  getSupplierReport: (params) => apiClient.get('/reports/supplier', { params }),
  getPurchaseReport: (params) => apiClient.get('/reports/purchases', { params }),
  
  // Branch Reports
  getBranchReport: (params) => apiClient.get('/reports/branch', { params }),
  getBranchComparison: () => apiClient.get('/reports/branch-comparison'),
  
  // Export
  exportPDF: (data) => apiClient.post('/reports/export-pdf', data, { responseType: 'blob' }),
  exportExcel: (data) => apiClient.post('/reports/export-excel', data, { responseType: 'blob' })
};