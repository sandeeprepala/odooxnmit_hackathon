import express from 'express';
import { createRazorpayOrder, verifyRazorpaySignature } from '../controllers/paymentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/razorpay/order', authenticate, createRazorpayOrder);
router.post('/razorpay/verify', authenticate, verifyRazorpaySignature);

export default router;


