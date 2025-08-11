import { api } from './api.js';

export const orderService = {
  createQuotation: (payload, token) => api.post('/rentals/quotation', payload, token),
  getByCustomer: (customerId, token) => api.get(`/rentals/customer/${customerId}`, token)
};


