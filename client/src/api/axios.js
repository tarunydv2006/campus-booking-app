import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');

if (!apiBaseUrl) {
  throw new Error('Missing VITE_API_URL. Set it to your backend API base URL, for example https://campus-booking-api.onrender.com/api.');
}

const api = axios.create({
  baseURL: apiBaseUrl,
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
    return `Cannot connect to backend at ${apiBaseUrl}. Please make sure the backend server is running.`;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Backend request timed out. Please try again.';
  }

  return error.message || fallback;
};
