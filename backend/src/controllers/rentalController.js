import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import Pricelist from '../models/Pricelist.js';
import { calculateItemPrice, calculateOrderTotals, calculateLateFees } from '../utils/priceCalculator.js';

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
      unit: product.rentalUnit,
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
  const order = await RentalOrder.create({
    customerId: req.user._id,
    status: 'quotation',
    items: populated,
    totalAmount: totals.totalAmount,
    deposit: totals.deposit,
    notes
  });
  res.status(201).json(order);
}

export async function confirmOrder(req, res) {
  const order = await RentalOrder.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  order.status = 'confirmed';
  await order.save();

  // Reduce product available quantities
  for (const it of order.items) {
    await Product.findByIdAndUpdate(it.productId, { $inc: { availableQuantity: -Math.abs(it.quantity) } });
  }
  res.json(order);
}

export async function getCustomerRentals(req, res) {
  const userId = req.params.customerId;
  if (String(userId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const orders = await RentalOrder.find({ customerId: userId }).sort({ createdAt: -1 });
  res.json(orders);
}

export async function getRentalById(req, res) {
  const order = await RentalOrder.findById(req.params.id)
    .populate('customerId', 'name email')
    .populate('items.productId', 'name category');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (String(order.customerId) !== String(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
}

export async function getMyRentals(req, res) {
  const orders = await RentalOrder.find({ customerId: req.user._id }).sort({ createdAt: -1 });
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
  for (const it of order.items) {
    await Product.findByIdAndUpdate(it.productId, { $inc: { availableQuantity: Math.abs(it.quantity) } });
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


