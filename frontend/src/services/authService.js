import { api } from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (email, password, role) => api.post('/auth/login', { email, password, role }),
  getProfile: (token) => api.get('/auth/profile', token).then((data) => data),
  updateProfile: (payload, token) => api.put('/auth/profile', payload, token),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword })
};


