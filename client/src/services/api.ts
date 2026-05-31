import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const baseURL = rawBaseURL.replace(/\/$/, '').endsWith('/api') ? rawBaseURL.replace(/\/$/, '') : `${rawBaseURL.replace(/\/$/, '')}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('summitai_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
