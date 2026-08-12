import apiClient from '../../../api/client';

export const reportService = {
  // Inventory Reports
  getInventoryReport: (params) => apiClient.get('/reports/inventory', { params }),
  
  // Sales Reports
  getSalesReport: (params) => apiClient.get('/reports/sales', { params }),
  
  // Profit Reports
  getProfitReport: (params) => apiClient.get('/reports/profit', { params }),
  
  // Export Functions
  exportPDF: (data) => apiClient.post('/reports/export-pdf', data, { 
    responseType: 'blob',
    headers: { 'Accept': 'application/pdf' }
  }),
  
  exportExcel: (data) => apiClient.post('/reports/export-excel', data, { 
    responseType: 'blob',
    headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  })
};


