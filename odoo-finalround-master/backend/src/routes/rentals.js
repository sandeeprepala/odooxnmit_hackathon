import express from 'express';
import {
  createQuotation,
  confirmOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  addPayment
} from '../controllers/rentalController.js'; // <-- rename controller file later if needed
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Create a quotation
router.post('/quotation', authenticate, createQuotation);

// Confirm an order
router.put('/:id/confirm', authenticate, confirmOrder);

// Get my orders
router.get('/', authenticate, getMyOrders);

// Get order by ID
router.get('/:id', authenticate, getOrderById);

// Cancel order
router.put('/:id/cancel', authenticate, cancelOrder);

// Add payment to an order
router.post('/:id/payment', authenticate, addPayment);

export default router;
