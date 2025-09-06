import { api } from './api.js';

export const orderService = {
  createQuotation: (payload, token) => api.post('/rentals/quotation', payload, token),
  getByCustomer: (customerId, token) => api.get(`/rentals/customer/${customerId}`, token),
  getAllAdmin: (token) => api.get('/admin/orders', token),
  getById: (id, token) => api.get(`/rentals/${id}`, token),
  updateStatusAdmin: (id, status, token) => api.put(`/admin/orders/${id}/status`, { status }, token)
};


