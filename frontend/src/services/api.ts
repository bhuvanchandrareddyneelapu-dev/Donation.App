import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api/v1') ? cleanUrl : `${cleanUrl}/api/v1`;
  }
  if (import.meta.env.PROD) {
    return 'https://donation-app-backend-tq17.onrender.com/api/v1';
  }
  return '/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('donationapp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const isAuthEndpoint = error.config && error.config.url && error.config.url.includes('/auth/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem('donationapp_token');
        localStorage.removeItem('donationapp_user');
        window.dispatchEvent(new Event('auth-session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
