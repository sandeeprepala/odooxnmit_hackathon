import { api } from './api.js';

export const paymentService = {
  // Get customer's pending payments
  getPendingPayments: (token) => api.get('/payments/customer/pending', token),
  
  // Create Razorpay order for a rental
  createRentalPaymentOrder: (orderId, amount, token) => 
    api.post(`/payments/rental/${orderId}/create-order`, { amount }, token),
  
  // Verify rental payment
  verifyRentalPayment: (paymentData, token) => 
    api.post('/payments/rental/verify', paymentData, token),
  
  // General Razorpay endpoints
  createRazorpayOrder: (payload, token) => api.post('/payments/razorpay/order', payload, token),
  verifyRazorpaySignature: (payload, token) => api.post('/payments/razorpay/verify', payload, token)
};
