import axios, { AxiosInstance } from 'axios';

interface CustomAxiosInstance extends AxiosInstance {
  setAuthToken: (token: string) => void;
  removeAuthToken: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
}) as CustomAxiosInstance;

// Add auth token to requests.
api.setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Remove auth token.
api.removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export default api;
