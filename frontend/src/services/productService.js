import { api } from './api.js';

export const productService = {
  list: () => api.get('/products'),
  get: (id) => api.get(`/products/${id}`),
  availability: (id, { startDate, endDate }) => api.get(`/products/${id}/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`)
};


