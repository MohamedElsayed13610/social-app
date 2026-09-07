import axios from 'axios';

export const TOKEN_KEY = 'vibelink_token';

const api = axios.create({
  baseURL: 'https://route-posts.routemisr.com',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export const apiMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.response?.data?.errors?.[0] || error?.message || fallback;

export default api;
