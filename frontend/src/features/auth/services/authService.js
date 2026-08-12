import apiClient from '../../../api/client';
import { endpoints } from '../../../api/endpoints';

export const authService = {
  login: (credentials) => apiClient.post(endpoints.auth.login, credentials),
  logout: () => apiClient.post(endpoints.auth.logout),
  refresh: (refreshToken) => apiClient.post(endpoints.auth.refresh, { refreshToken }),
  getCurrentUser: () => apiClient.get(endpoints.auth.me),
  changePassword: (data) => apiClient.post(endpoints.auth.changePassword, data),
  forgotPassword: (email) => apiClient.post(endpoints.auth.forgotPassword, { email }),
  resetPassword: (token, newPassword) => 
    apiClient.post(endpoints.auth.resetPassword, { token, newPassword }),
};

export const refreshToken = (refreshToken) => 
  apiClient.post(endpoints.auth.refresh, { refreshToken });


