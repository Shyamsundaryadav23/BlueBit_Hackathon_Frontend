import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosInstance extends AxiosInstance {
  setAuthToken: (token: string) => void;
  removeAuthToken: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000', // Fallback for development
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
}) as CustomAxiosInstance;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

api.removeAuthToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common.Authorization;
};

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      api.removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
