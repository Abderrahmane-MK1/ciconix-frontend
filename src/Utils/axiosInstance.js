import axios from 'axios';
import { getTokens, saveTokens, clearTokens } from './auth';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables to handle token refresh queue
let isRefreshing = false;
let failedQueue = [];

// Process all requests waiting in queue
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// REQUEST INTERCEPTOR - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const { access_token } = getTokens();
    
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle 401 errors and refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    // If request is successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if:
    // 1. Error is 401 (Unauthorized)
    // 2. We haven't already tried to retry this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If already refreshing, add this request to queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Mark that we're retrying this request
      originalRequest._retry = true;
      // Set flag that refresh is in progress
      isRefreshing = true;

      const { refresh_token } = getTokens();
      
      // If no refresh token, redirect to login
      if (!refresh_token) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint (use plain axios to avoid interceptor loop)
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refresh_token
        });

        const { access } = response.data;
        
        // Save new tokens
        saveTokens({
          access: access,
          refresh: refresh_token,
          expires_in: response.data.expires_in || 3600
        });

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Resolve all queued requests with new token
        processQueue(null, access);
        
        // Retry the original request
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        // Always reset the refreshing flag
        isRefreshing = false;
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default axiosInstance;