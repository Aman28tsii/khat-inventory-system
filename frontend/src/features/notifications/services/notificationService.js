import apiClient from '../../../api/client';

export const notificationService = {
  getAll: (params) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
  deleteAll: () => apiClient.delete('/notifications'),
  getPreferences: () => apiClient.get('/notifications/preferences'),
  updatePreferences: (data) => apiClient.put('/notifications/preferences', data)
};