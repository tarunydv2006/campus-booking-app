import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://campus-booking-app.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  if (error.response?.data?.message) return error.response.data.message;

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Cannot connect to backend at https://campus-booking-app.onrender.com/api. Please make sure the backend server is running.';
  }

  if (error.code === 'ECONNABORTED') {
    return 'Backend request timed out. Please try again.';
  }

  return error.message || fallback;
};
