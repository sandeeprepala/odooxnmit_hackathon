import { api } from './api.js';

export const productService = {
  list: (opts, token, userRole) => {
    const query = new URLSearchParams({ ...(opts || {}) }).toString();
    // Use admin endpoint only if user is admin and has valid token
    const endpoint = (userRole === 'admin' && token) ? '/admin/products' : '/products';
    console.log('ProductService.list called with:', { opts, userRole, endpoint, hasToken: !!token });
    return api.get(`${endpoint}${query ? `?${query}` : ''}`, token);
  },
  get: (id) => api.get(`/products/${id}`),
  availability: (id, { startDate, endDate }) => api.get(`/products/${id}/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`),
  create: async (payload, files, token) => {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => form.append(k, v));
    (files || []).forEach((f) => form.append('images', f));
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};


