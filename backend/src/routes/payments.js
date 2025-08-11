import express from 'express';
import { 
  createRazorpayOrder, 
  verifyRazorpaySignature,
  getCustomerPendingPayments,
  createRentalPaymentOrder,
  verifyRentalPayment
} from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// General Razorpay endpoints
router.post('/razorpay/order', authenticate, createRazorpayOrder);
router.post('/razorpay/verify', authenticate, verifyRazorpaySignature);

// Customer rental payment endpoints
router.get('/customer/pending', authenticate, getCustomerPendingPayments);
router.post('/rental/:orderId/create-order', authenticate, createRentalPaymentOrder);
router.post('/rental/verify', authenticate, verifyRentalPayment);

export default router;


