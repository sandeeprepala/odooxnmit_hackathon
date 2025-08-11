import express from 'express';
import {
  createQuotation,
  confirmOrder,
  getCustomerRentals,
  getRentalById,
  markPickup,
  markReturn,
  cancelOrder,
  addPayment
} from '../controllers/rentalController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/quotation', authenticate, createQuotation);
router.put('/:id/confirm', authenticate, confirmOrder);
router.get('/customer/:customerId', authenticate, getCustomerRentals);
router.get('/:id', authenticate, getRentalById);
router.put('/:id/pickup', authenticate, authorize('admin'), markPickup);
router.put('/:id/return', authenticate, authorize('admin'), markReturn);
router.put('/:id/cancel', authenticate, cancelOrder);
router.post('/:id/payment', authenticate, addPayment);

export default router;


