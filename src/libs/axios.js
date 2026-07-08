import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { useAuthStore } from '../hooks/useAuthStore';

const api = axios.create({
  baseURL: API_BASE_URL.API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isUnauthorized =
      error.response &&
      (error.response.status === 401 || error.response.status === 403);

    const isSigninUrl = originalRequest?.url?.includes('/signin');
    const isRefreshUrl = originalRequest?.url?.includes('/refresh-token');
    const isSignoutUrl = originalRequest?.url?.includes('/signout');

    if (isUnauthorized && !originalRequest._retry && !isRefreshUrl && !isSigninUrl && !isSignoutUrl) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get('/auth/refresh-token');
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        useAuthStore.getState().logout().catch(() => {});
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
