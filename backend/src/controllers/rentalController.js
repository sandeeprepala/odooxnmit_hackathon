import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import Pricelist from '../models/Pricelist.js';
import { calculateItemPrice, calculateOrderTotals, calculateLateFees } from '../utils/priceCalculator.js';
import { areRangesOverlapping } from '../utils/availability.js';
import User from '../models/User.js'; // Added import for User

export async function createQuotation(req, res) {
  const { items, notes } = req.body;
  const populated = [];
  for (const it of items) {
    const product = await Product.findById(it.productId);
    if (!product || !product.isActive) return res.status(400).json({ message: 'Invalid product' });
    const rule = await Pricelist.findOne({ isActive: true, 'rules.productId': product._id });
    const ruleForProduct = rule?.rules?.find(r => String(r.productId) === String(product._id));
    const pricing = calculateItemPrice({
      basePrice: product.basePrice,
      unit: 'day',
      startDate: it.startDate,
      endDate: it.endDate,
      rule: ruleForProduct
    });
    populated.push({
      productId: product._id,
      quantity: it.quantity,
      startDate: it.startDate,
      endDate: it.endDate,
      pricePerUnit: pricing.pricePerUnit,
      totalPrice: pricing.totalPrice * it.quantity
    });
  }

  const totals = calculateOrderTotals(populated);
  
  // Get customer address from user profile
  const user = await User.findById(req.user._id);
  const customerAddress = user.address ? {
    street: user.address.street,
    city: user.address.city,
    state: user.address.state,
    zipCode: user.address.zipCode,
    phone: user.phone
  } : null;

  const order = await RentalOrder.create({
    customerId: req.user._id,
    status: 'quotation',
    items: populated,
    totalAmount: totals.totalAmount,
    deposit: totals.deposit,
    notes,
    customerAddress
  });
  res.status(201).json(order);
}

export async function confirmOrder(req, res) {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Check if order is already confirmed
  if (order.status === 'confirmed') {
    return res.status(400).json({ message: 'Order is already confirmed' });
  }
  
  // Check availability for all items before confirming
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }
    
    // Get all confirmed orders for this product that overlap with the current booking
    const overlappingOrders = await RentalOrder.find({
      status: { $in: ['confirmed', 'picked_up'] },
      'items.productId': item.productId,
      _id: { $ne: order._id } // Exclude current order
    });
    
    let bookedQuantity = 0;
    for (const overlappingOrder of overlappingOrders) {
      for (const overlappingItem of overlappingOrder.items) {
        if (String(overlappingItem.productId) === String(item.productId)) {
          if (areRangesOverlapping(
            overlappingItem.startDate, 
            overlappingItem.endDate, 
            item.startDate, 
            item.endDate
          )) {
            bookedQuantity += overlappingItem.quantity;
          }
        }
      }
    }
    
    const availableQuantity = product.quantity - bookedQuantity;
    if (availableQuantity < item.quantity) {
      return res.status(400).json({ 
        message: `Insufficient availability for ${product.name}. Available: ${availableQuantity}, Requested: ${item.quantity}` 
      });
    }
  }
  
  order.status = 'confirmed';
  await order.save();
  
  // Decrease product available quantities when confirmed
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, { 
      $inc: { availableQuantity: -Math.abs(item.quantity) } 
    });
  }
  
  res.json(order);
}

export async function getCustomerRentals(req, res) {
  const userId = req.params.customerId;
  if (String(userId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const orders = await RentalOrder.find({ customerId: userId })
    .populate('items.productId', 'name')
    .sort({ createdAt: -1 });
  res.json(orders);
}

export async function getRentalById(req, res) {
  const order = await RentalOrder.findById(req.params.id)
    .populate('customerId', 'name email')
    .populate('items.productId', 'name');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
}

export async function getMyRentals(req, res) {
  const orders = await RentalOrder.find({ customerId: req.user._id })
    .populate('items.productId', 'name')
    .sort({ createdAt: -1 });
  res.json(orders);
}

export async function markPickup(req, res) {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'picked_up';
  order.pickupDate = new Date();
  await order.save();
  res.json(order);
}

export async function markReturn(req, res) {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'returned';
  order.actualReturnDate = new Date();
  const lateFees = calculateLateFees({ expectedReturn: order.returnDate || order.items?.[0]?.endDate, actualReturn: order.actualReturnDate });
  order.lateFees = lateFees;
  await order.save();

  // Increase product available quantities back on return
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, { 
      $inc: { availableQuantity: Math.abs(item.quantity) } 
    });
  }
  
  res.json(order);
}

export async function cancelOrder(req, res) {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = 'cancelled';
  await order.save();
  res.json(order);
}

export async function addPayment(req, res) {
  const { amount, paymentMethod, transactionId } = req.body;
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.paymentDetails.push({ amount, paymentDate: new Date(), paymentMethod, transactionId });
  const paid = order.paymentDetails.reduce((s, p) => s + p.amount, 0);
  if (paid >= order.totalAmount + order.lateFees) order.paymentStatus = 'paid';
  else if (paid > 0) order.paymentStatus = 'partial';
  await order.save();
  res.json(order);
}


