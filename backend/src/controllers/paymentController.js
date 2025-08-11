import crypto from 'crypto';
import { getRazorpayClient } from '../config/razorpay.js';
import { env } from '../config/env.js';
import RentalOrder from '../models/RentalOrder.js';

export async function createRazorpayOrder(req, res) {
  const { amount, currency = 'INR', receipt } = req.body;
  const client = getRazorpayClient();
  if (!client) return res.status(400).json({ message: 'Razorpay not configured' });
  const order = await client.orders.create({ amount: amount * 100, currency, receipt: receipt || `rcpt_${Date.now()}` });
  res.json(order);
}

export async function verifyRazorpaySignature(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
  const hmac = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET);
  hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = hmac.digest('hex');
  if (digest !== razorpay_signature) return res.status(400).json({ message: 'Invalid signature' });
  const order = await RentalOrder.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentDetails.push({ amount: order.totalAmount, paymentDate: new Date(), paymentMethod: 'razorpay', transactionId: razorpay_payment_id });
  order.paymentStatus = 'paid';
  await order.save();
  res.json({ success: true });
}


