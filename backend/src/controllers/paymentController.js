import crypto from 'crypto';
import { getRazorpayClient } from '../config/razorpay.js';
import { env } from '../config/env.js';
import RentalOrder from '../models/RentalOrder.js';

export async function createRazorpayOrder(req, res) {
  const { amount, currency = 'INR', receipt } = req.body;
  const client = getRazorpayClient();
  if (!client) return res.status(400).json({ message: 'Razorpay not configured' });
  
  // Use provided receipt or generate a short one
  const shortReceipt = receipt || `R${Date.now().toString().slice(-8)}`;
  
  const order = await client.orders.create({ 
    amount: amount * 100, 
    currency, 
    receipt: shortReceipt 
  });
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

// Get customer's pending payments (confirmed orders that need payment)
export async function getCustomerPendingPayments(req, res) {
  try {
    const orders = await RentalOrder.find({
      customerId: req.user._id,
      status: 'confirmed',
      paymentStatus: { $ne: 'paid' }
    }).populate('items.productId', 'name image');
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
}

// Create Razorpay order for a specific rental order
export async function createRentalPaymentOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;
    
    // Verify the order belongs to the customer and is confirmed
    const order = await RentalOrder.findOne({
      _id: orderId,
      customerId: req.user._id,
      status: 'confirmed',
      paymentStatus: { $ne: 'paid' }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not eligible for payment' });
    }
    
    const client = getRazorpayClient();
    if (!client) {
      return res.status(400).json({ message: 'Razorpay not configured' });
    }
    
    // Create Razorpay order with shorter receipt (max 40 chars)
    const receipt = `R${orderId.slice(-8)}${Date.now().toString().slice(-6)}`;
    
    const razorpayOrder = await client.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receipt, // Shortened receipt format
      notes: {
        orderId: orderId,
        customerId: req.user._id.toString()
      }
    });
    
    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
      orderId: orderId
    });
    
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
}

// Verify payment and update order status
export async function verifyRentalPayment(req, res) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderId 
    } = req.body;
    
    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');
    
    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
    
    // Find and update the rental order
    const order = await RentalOrder.findOne({
      _id: orderId,
      customerId: req.user._id,
      status: 'confirmed'
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Add payment details
    order.paymentDetails.push({
      amount: order.totalAmount,
      paymentDate: new Date(),
      paymentMethod: 'razorpay',
      transactionId: razorpay_payment_id
    });
    
    order.paymentStatus = 'paid';
    await order.save();
    
    res.json({ 
      success: true, 
      message: 'Payment successful! Your order has been confirmed.',
      order: order
    });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
}


