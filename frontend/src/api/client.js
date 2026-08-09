import axios from 'axios';
import { logout, setCredentials } from '../features/auth/slices/authSlice';
import { refreshToken } from '../features/auth/services/authService';

const API_URL = 'https://khat-inventory-system.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

let storeRef = null;

export const setStore = (store) => {
  storeRef = store;
};

apiClient.interceptors.request.use(
  (config) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.auth.accessToken;
      if (token) {
        config.headers.Authorization = Bearer ;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        if (!storeRef) throw new Error('Store not initialized');
        const state = storeRef.getState();
        const refreshTokenValue = state.auth.refreshToken;
        
        if (!refreshTokenValue) {
          storeRef.dispatch(logout());
          return Promise.reject(error);
        }
        
        const response = await refreshToken(refreshTokenValue);
        const { accessToken, refreshToken: newRefreshToken, user } = response.data;
        
        storeRef.dispatch(setCredentials({
          accessToken,
          refreshToken: newRefreshToken,
          user,
        }));
        
        originalRequest.headers.Authorization = Bearer ;
        return apiClient(originalRequest);
      } catch (refreshError) {
        storeRef.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

