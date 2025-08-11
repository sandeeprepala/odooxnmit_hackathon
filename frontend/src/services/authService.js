import { api } from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: (token) => api.get('/auth/profile', token).then((data) => data),
  updateProfile: (payload, token) => api.put('/auth/profile', payload, token)
};


