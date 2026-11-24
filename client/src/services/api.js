import axios from 'axios';
import { auth } from '../config/firebase';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 20000 });
api.interceptors.request.use(async (config) => {
  if (auth?.currentUser) config.headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  return config;
});
api.interceptors.response.use((result) => result, (error) => Promise.reject(new Error(error.response?.data?.error || error.message || 'Network error')));
