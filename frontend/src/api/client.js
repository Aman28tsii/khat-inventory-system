import axios from 'axios';
import store from '../app/store';
import { logout, setCredentials } from '../features/auth/slices/authSlice';
import { refreshToken } from '../features/auth/services/authService';

const API_URL = process.env.REACT_APP_API_URL || 'https://khat-inventory-system.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - always use fresh token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5YzI5YmFjLTZkOTctNGI3Yi04ODQ2LTI4MGZlNmUwYzdiNiIsImlhdCI6MTc4NjI2NzE2MywiZXhwIjoxNzg2MjY4MDYzfQ.nWbSBPh1_616lyodGdyfuABuEJ4EM11ntuV4gx1trVU;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        
        if (!refreshTokenValue) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(${API_URL}/auth/refresh, { refreshToken: refreshTokenValue });
        const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        if (store) {
          store.dispatch(setCredentials({
            accessToken,
            refreshToken: newRefreshToken,
            user,
          }));
        }
        
        originalRequest.headers.Authorization = Bearer ;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
