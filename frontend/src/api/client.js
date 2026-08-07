import axios from 'axios';
import store from '../app/store';
import { logout, setCredentials } from '../features/auth/slices/authSlice';
import { refreshToken } from '../features/auth/services/authService';

// Use environment variable with fallback to Render URL
const API_URL = process.env.REACT_APP_API_URL || 'https://khat-inventory-system.onrender.com/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    
    // If unauthorized and not retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const refreshTokenValue = state.auth.refreshToken;
        
        if (!refreshTokenValue) {
          store.dispatch(logout());
          return Promise.reject(error);
        }
        
        // Refresh token
        const response = await refreshToken(refreshTokenValue);
        const { accessToken, refreshToken: newRefreshToken, user } = response.data;
        
        // Update store
        store.dispatch(setCredentials({
          accessToken,
          refreshToken: newRefreshToken,
          user,
        }));
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;